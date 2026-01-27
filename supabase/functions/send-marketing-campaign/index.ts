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

    // Utiliser le client admin pour les opérations privilégiées
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Vérifier le quota hebdomadaire
    const weekStart = getWeekStart();
    
    // Récupérer ou créer le quota
    let { data: quota, error: quotaError } = await supabaseAdmin
      .from("mcard_marketing_quotas")
      .select("*")
      .eq("mcard_id", mcardId)
      .eq("week_start", weekStart)
      .maybeSingle();

    if (!quota) {
      const { data: newQuota, error: createError } = await supabaseAdmin
        .from("mcard_marketing_quotas")
        .insert({
          mcard_id: mcardId,
          week_start: weekStart
        })
        .select()
        .single();
      
      if (createError) {
        console.error("Error creating quota:", createError);
        throw new Error("Failed to create weekly quota");
      }
      quota = newQuota;
    }

    // Calculer les messages disponibles
    const FREE_LIMIT = 20;
    const freeRemaining = Math.max(0, FREE_LIMIT - quota.free_messages_used);
    const paidRemaining = quota.paid_messages_available - quota.paid_messages_used;
    const totalRemaining = freeRemaining + paidRemaining;

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

    // Vérifier si on peut envoyer à tous les destinataires
    const recipientCount = favorites.length;
    if (recipientCount > totalRemaining) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Quota insuffisant. Vous avez ${totalRemaining} messages disponibles mais ${recipientCount} destinataires.`,
          quota: {
            freeRemaining,
            paidRemaining,
            totalRemaining
          }
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending campaign to ${recipientCount} recipients via Finder ID messaging`);

    const campaignEmoji = getCampaignEmoji(campaign.campaign_type);
    const typeLabel = getTypeLabel(campaign.campaign_type);
    
    // Calculer la date d'expiration (3 jours)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3);
    
    // Créer un message pour chaque favori
    const messages = favorites.map((favorite: { user_id: string }) => ({
      sender_id: user.id,
      recipient_id: favorite.user_id,
      mcard_id: mcardId,
      subject: `${campaignEmoji} ${typeLabel}: ${campaign.title}`,
      message: campaign.message,
      is_read: false,
      is_marketing: true,
      expires_at: expiresAt.toISOString()
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

    // Mettre à jour le quota
    let freeUsed = 0;
    let paidUsed = 0;

    if (totalSent <= freeRemaining) {
      freeUsed = totalSent;
    } else {
      freeUsed = freeRemaining;
      paidUsed = totalSent - freeRemaining;
    }

    await supabaseAdmin
      .from("mcard_marketing_quotas")
      .update({
        free_messages_used: quota.free_messages_used + freeUsed,
        paid_messages_used: quota.paid_messages_used + paidUsed,
        updated_at: new Date().toISOString()
      })
      .eq("id", quota.id);

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
      message: `Votre campagne "${campaign.title}" a été envoyée à ${totalSent} personnes. Les messages expireront dans 3 jours.`
    });

    console.log(`Campaign sent successfully to ${totalSent} recipients`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        recipientCount: totalSent,
        quotaUsed: {
          free: freeUsed,
          paid: paidUsed
        }
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

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

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
