import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es l'assistant IA de Finder ID, une application qui permet de :
1. Enregistrer et protéger ses documents d'identité (CNI, passeport, permis)
2. Signaler un document trouvé et gagner 2000 FCFA après restitution
3. Rechercher un document perdu via son numéro
4. Créer des cartes de visite digitales (MCard) avec partage NFC/QR
5. Gérer son entreprise (facturation, devis, marketing, fidélité)

Règles :
- Réponds toujours en français sauf si l'utilisateur parle anglais
- Sois concis et utile (max 3-4 phrases)
- Guide les utilisateurs vers les bonnes fonctionnalités
- Pour le support : support@finderid.com
- Ne mentionne jamais "Lovable" ou d'autres marques
- Appelle l'app "Finder ID" uniquement

Fonctionnalités clés à connaître :
- Système de parrainage : partagez votre code et gagnez des points
- MCard : carte de visite digitale (plans Free, Essential, Premium)
- Géolocalisation : les documents trouvés sont localisés sur une carte
- Numéros d'urgence : police, hôpital, pompiers au Sénégal
- Programme de fidélité : gagnez des points en interagissant avec les MCards`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
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
          { role: "system", content: SYSTEM_PROMPT },
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
