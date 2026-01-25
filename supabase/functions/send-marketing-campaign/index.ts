import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    // Récupérer les emails des favoris via la fonction RPC
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

    console.log(`Sending campaign to ${favorites.length} recipients`);

    const recipientEmails = favorites.map((f: any) => f.email).filter(Boolean) as string[];
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") ?? "FinderID <notifications@resend.dev>";

    // Générer le HTML de l'email
    const emailHtml = generateCampaignEmailHtml({
      title: campaign.title,
      message: campaign.message,
      mcardName: mcard.full_name,
      campaignType: campaign.campaign_type
    });

    const chunkSize = 49;
    let totalSent = 0;
    const errors: string[] = [];

    for (let i = 0; i < recipientEmails.length; i += chunkSize) {
      const chunk = recipientEmails.slice(i, i + chunkSize);
      console.log(`Sending chunk ${Math.floor(i / chunkSize) + 1}: ${chunk.length} recipients`);

      try {
        const { error: sendError } = await resend.emails.send({
          from: fromEmail,
          to: "notifications@resend.dev",
          bcc: chunk,
          subject: `${getCampaignEmoji(campaign.campaign_type)} ${campaign.title}`,
          html: emailHtml,
        });

        if (sendError) {
          console.error("Resend error:", sendError);
          errors.push(sendError.message);
        } else {
          totalSent += chunk.length;
        }
      } catch (e) {
        console.error("Exception sending chunk:", e);
        errors.push(e.message);
      }
    }

    // Mettre à jour le statut de la campagne
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

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
      message: `Votre campagne "${campaign.title}" a été envoyée à ${totalSent} personnes.`
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        recipientCount: totalSent,
        errors: errors.length > 0 ? errors : undefined
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

interface EmailTemplateProps {
  title: string;
  message: string;
  mcardName: string;
  campaignType: string;
}

function generateCampaignEmailHtml({ title, message, mcardName, campaignType }: EmailTemplateProps): string {
  const emoji = getCampaignEmoji(campaignType);
  const typeLabel = {
    promotion: "Offre spéciale",
    announcement: "Annonce importante",
    event: "Événement à venir",
    reminder: "Rappel"
  }[campaignType] || "Message";

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">${emoji}</div>
              <div style="color: rgba(255,255,255,0.8); font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${typeLabel}</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${title}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </p>
              
              <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Cette offre vous est proposée par</p>
                <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${mcardName}</p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">
                Vous recevez cet email car vous avez ajouté cette MCard à vos favoris.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} FinderID. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
