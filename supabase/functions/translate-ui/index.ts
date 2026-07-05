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
    const { texts, targetLang } = await req.json();
    if (!Array.isArray(texts) || !targetLang) {
      return new Response(JSON.stringify({ error: 'texts[] and targetLang required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (targetLang === 'fr' || texts.length === 0) {
      return new Response(JSON.stringify({ translations: texts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const languageName = LANG_NAMES[targetLang] ?? targetLang;
    // Build a numbered list to translate as JSON array
    const payload = texts.map((t, i) => ({ i, text: String(t) }));

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
            content: `You translate UI strings from French to ${languageName}. Input is a JSON array of {i, text}. Output ONLY a JSON array of {i, translation} with the same indices. Keep placeholders like {name}, {count} unchanged. Keep emojis, punctuation, casing style. Do not add commentary.`,
          },
          { role: 'user', content: JSON.stringify(payload) },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiRes.ok) {
      const errTxt = await aiRes.text();
      console.error('AI gateway error', aiRes.status, errTxt);
      return new Response(JSON.stringify({ error: 'translation_failed', detail: errTxt }), {
        status: aiRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await aiRes.json();
    const raw = data?.choices?.[0]?.message?.content ?? '[]';
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Try to extract array from a wrapper object
      const m = raw.match(/\[[\s\S]*\]/);
      parsed = m ? JSON.parse(m[0]) : [];
    }
    const arr = Array.isArray(parsed) ? parsed : (parsed?.translations ?? parsed?.result ?? []);
    const translations = texts.map((t, i) => {
      const found = arr.find((x: any) => x && Number(x.i) === i);
      return found?.translation ?? found?.text ?? t;
    });

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('translate-ui error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
