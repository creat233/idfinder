import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { campaignId, mcardId } = await req.json();
    if (!campaignId || !mcardId) {
      throw new Error("Campaign ID and MCard ID are required");
    }

    // Vérifier que l'utilisateur est propriétaire de la MCard
    const { data: mcard, error: mcardError } = await supabaseClient
      .from("mcards")
      .select("id, full_name, user_id")
      .eq("id", mcardId)
      .eq("user_id", user.id)
      .single();

    if (mcardError || !mcard) {
      throw new Error("MCard not found or access denied");
    }

    // Récupérer la campagne
    const { data: campaign, error: campaignError } = await supabaseClient
      .from("mcard_marketing_campaigns")
      .select("*")
      .eq("id", campaignId)
      .eq("mcard_id", mcardId)
      .single();

    if (campaignError || !campaign) {
      throw new Error("Campaign not found");
    }

    if (campaign.status !== "draft") {
      throw new Error("Campaign already sent or cancelled");
    }

    // Récupérer les user_ids des favoris via la fonction RPC
    const { data: favorites, error: favoritesError } = await supabaseClient
      .rpc("get_mcard_favorite_emails", { p_mcard_id: mcardId });

    if (favoritesError) {
      console.error("Error fetching favorites:", favoritesError);
      throw new Error("Failed to fetch recipients");
    }

    if (!favorites || favorites.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No recipients found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending campaign to ${favorites.length} recipients via Finder ID messaging`);

    // Utiliser le client admin pour insérer les messages
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const campaignEmoji = getCampaignEmoji(campaign.campaign_type);
    const typeLabel = getTypeLabel(campaign.campaign_type);
    
    // Créer un message pour chaque favori
    const messages = favorites.map((favorite: { user_id: string }) => ({
      sender_id: user.id,
      recipient_id: favorite.user_id,
      mcard_id: mcardId,
      subject: `${campaignEmoji} ${typeLabel}: ${campaign.title}`,
      message: campaign.message,
      is_read: false
    }));

    // Insérer tous les messages en une seule requête
    const { error: insertError } = await supabaseAdmin
      .from("mcard_messages")
      .insert(messages);

    if (insertError) {
      console.error("Error inserting messages:", insertError);
      throw new Error("Failed to send messages");
    }

    const totalSent = messages.length;

    // Mettre à jour le statut de la campagne
    await supabaseAdmin
      .from("mcard_marketing_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        recipients_count: totalSent
      })
      .eq("id", campaignId);

    // Créer une notification pour le propriétaire
    await supabaseAdmin.from("notifications").insert({
      user_id: user.id,
      type: "campaign_sent",
      title: "📧 Campagne envoyée !",
      message: `Votre campagne "${campaign.title}" a été envoyée à ${totalSent} personnes via la messagerie Finder ID.`
    });

    console.log(`Campaign sent successfully to ${totalSent} recipients`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        recipientCount: totalSent
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-marketing-campaign:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getCampaignEmoji(type: string): string {
  switch (type) {
    case "promotion": return "🎁";
    case "announcement": return "📢";
    case "event": return "📅";
    case "reminder": return "💡";
    default: return "✨";
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case "promotion": return "Offre spéciale";
    case "announcement": return "Annonce";
    case "event": return "Événement";
    case "reminder": return "Rappel";
    default: return "Message";
  }
}
