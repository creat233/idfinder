// AI auto-reply agent — invoked by Postgres trigger via pg_net when
// auto_reply_settings.ai_agent_enabled = true for the recipient.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { message_id } = await req.json();
    if (!message_id) {
      return new Response(JSON.stringify({ error: 'message_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Load the incoming message
    const { data: msg, error: msgErr } = await supabase
      .from('mcard_messages')
      .select('id, sender_id, recipient_id, mcard_id, message, subject')
      .eq('id', message_id)
      .single();
    if (msgErr || !msg) throw msgErr ?? new Error('message not found');

    // Skip AI replies to auto-generated messages
    if (msg.subject === '[Auto-réponse]' || msg.subject === '[Agent IA]') {
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Load recipient settings
    const { data: settings } = await supabase
      .from('auto_reply_settings')
      .select('ai_agent_enabled, ai_context, custom_message')
      .eq('user_id', msg.recipient_id)
      .single();
    if (!settings?.ai_agent_enabled) {
      return new Response(JSON.stringify({ skipped: 'ai_disabled' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Load mcard + products + statuses for knowledge base
    const [{ data: mcard }, { data: products }, { data: statuses }] = await Promise.all([
      supabase.from('mcards').select('full_name, job_title, company, description, phone_number, email, website_url').eq('id', msg.mcard_id).single(),
      supabase.from('mcard_products').select('name, description, price, currency, category, stock_quantity').eq('mcard_id', msg.mcard_id).eq('is_active', true).limit(30),
      supabase.from('mcard_statuses').select('status_text').eq('mcard_id', msg.mcard_id).eq('is_active', true).limit(20),
    ]);

    const kb = {
      profil: mcard,
      contexte_metier: settings.ai_context ?? null,
      produits_services: (products ?? []).map(p => ({
        nom: p.name, description: p.description, prix: p.price, devise: p.currency,
        categorie: p.category, stock: p.stock_quantity,
      })),
      statuts: (statuses ?? []).map(s => s.status_text),
    };

    let reply = settings.custom_message || 'Merci pour votre message ! Je reviens vers vous rapidement.';

    if (LOVABLE_API_KEY) {
      const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Lovable-API-Key': LOVABLE_API_KEY,
        },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            {
              role: 'system',
              content:
`Tu es l'assistant virtuel de ${mcard?.full_name ?? 'ce professionnel'}${mcard?.company ? ' (' + mcard.company + ')' : ''}.
Tu réponds aux clients en français, chaleureusement, brièvement (3 à 6 phrases maximum), en utilisant UNIQUEMENT les informations de la base de connaissances ci-dessous.
Si une information (prix, disponibilité, horaires) n'est pas dans la base, dis honnêtement que tu vas transmettre la question au propriétaire.
Ne promets jamais de rendez-vous, de livraison ou de tarifs qui ne figurent pas dans la base.
Signe par: "— Assistant de ${mcard?.full_name ?? 'l\'équipe'}".

BASE DE CONNAISSANCES:
${JSON.stringify(kb, null, 2)}`,
            },
            { role: 'user', content: msg.message ?? '' },
          ],
        }),
      });

      if (aiRes.ok) {
        const data = await aiRes.json();
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content === 'string' && content.trim().length > 0) {
          reply = content.trim();
        }
      } else {
        console.error('AI gateway error', aiRes.status, await aiRes.text());
      }
    }

    // Insert AI reply back into the conversation
    const { error: insertErr } = await supabase.from('mcard_messages').insert({
      sender_id: msg.recipient_id,
      recipient_id: msg.sender_id,
      mcard_id: msg.mcard_id,
      subject: '[Agent IA]',
      message: reply,
    });
    if (insertErr) throw insertErr;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('ai-auto-reply error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
