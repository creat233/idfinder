import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LANG_NAMES: Record<string, string> = {
  fr: "French", en: "English", es: "Spanish", pt: "Portuguese",
  ar: "Arabic", wo: "Wolof", de: "German", it: "Italian",
  zh: "Chinese (Simplified)", ru: "Russian",
};

const buildSystemPrompt = (lang: string) => {
  const languageName = LANG_NAMES[lang] ?? "French";
  return `You are the AI assistant for Finder ID, an app that allows users to:
1. Register and protect ID documents (national ID, passport, driving license)
2. Report a found document and earn 2000 FCFA after returning it
3. Search for a lost document via its number
4. Create digital business cards (MCard) with NFC/QR sharing
5. Manage business (invoicing, quotes, marketing, loyalty)

CRITICAL RULES:
- ALWAYS reply strictly in ${languageName}. Do not mix languages.
- Be concise and helpful (max 3-4 sentences)
- Guide users to the right features
- Support email: support@finderid.com
- Never mention "Lovable" or other brands
- Refer to the app only as "Finder ID"

Key features:
- Referral system: share your code and earn points
- MCard: digital business card (Free, Essential, Premium plans)
- Geolocation: found documents shown on a map
- Emergency numbers: police, hospital, fire
- Loyalty program: earn points by interacting with MCards`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, language } = await req.json();
    const lang = typeof language === 'string' ? language : 'fr';
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: buildSystemPrompt(lang) },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans un moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporairement indisponible." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chatbot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
