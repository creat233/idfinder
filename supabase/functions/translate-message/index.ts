import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const LANG_NAMES: Record<string, string> = {
  fr: 'French', en: 'English', es: 'Spanish', pt: 'Portuguese',
  ar: 'Arabic', wo: 'Wolof', de: 'German', it: 'Italian',
  zh: 'Chinese (Simplified)', ru: 'Russian',
  ja: 'Japanese', ko: 'Korean', hi: 'Hindi', tr: 'Turkish',
  nl: 'Dutch', pl: 'Polish', sv: 'Swedish', no: 'Norwegian',
  da: 'Danish', fi: 'Finnish', el: 'Greek', he: 'Hebrew',
  th: 'Thai', vi: 'Vietnamese', id: 'Indonesian', ms: 'Malay',
  sw: 'Swahili', uk: 'Ukrainian', cs: 'Czech', ro: 'Romanian',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { text, targetLang } = await req.json();
    if (!text || !targetLang) {
      return new Response(JSON.stringify({ error: 'text and targetLang required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const languageName = LANG_NAMES[targetLang] ?? targetLang;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the user's text to ${languageName}. Return ONLY the translation, no quotes, no explanation, no prefix. Preserve line breaks, emojis and punctuation.`,
          },
          { role: 'user', content: String(text) },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errTxt = await aiRes.text();
      console.error('AI gateway error', aiRes.status, errTxt);
      return new Response(JSON.stringify({ error: 'translation_failed', detail: errTxt }), {
        status: aiRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await aiRes.json();
    const translation = data?.choices?.[0]?.message?.content?.trim() ?? '';
    return new Response(JSON.stringify({ translation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('translate-message error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
