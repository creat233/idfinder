
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./utils.ts";
import { RecoveryNotificationRequest } from "./types.ts";
import { 
  createSupabaseClient, 
  fetchCardData, 
  fetchPromoData, 
  recordPromoUsage, 
  updateCardStatus 
} from "./database.ts";
import { generateEmailContent } from "./email-template.ts";
import { sendRecoveryEmail } from "./email-service.ts";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createSupabaseClient(req);
    
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error("❌ Erreur de parsing JSON:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Format de données invalide",
          details: "Les données reçues ne sont pas au format JSON valide"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { cardId, ownerInfo, promoInfo }: RecoveryNotificationRequest = requestBody;

    if (!cardId || !ownerInfo?.name || !ownerInfo?.phone) {
      return new Response(
        JSON.stringify({ 
          error: "Données manquantes",
          details: "L'ID de la carte, le nom et le téléphone du propriétaire sont requis"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("🚀 Traitement de la demande de récupération pour la carte:", cardId);
    console.log("👤 Propriétaire:", ownerInfo.name, "-", ownerInfo.phone);
    if (promoInfo) {
      console.log("🎁 Code promo utilisé - ID:", promoInfo.promoCodeId, "- Réduction:", promoInfo.discount, "FCFA");
    }

    const cardData = await fetchCardData(supabaseClient, cardId);

    const finalPrice = promoInfo ? promoInfo.finalPrice : 7000;
    
    const updatedDescription = `${cardData.description || ''}

--- INFORMATIONS DE RÉCUPÉRATION ---
Nom du propriétaire: ${ownerInfo.name}
Téléphone: ${ownerInfo.phone}
Prix final: ${finalPrice} FCFA
${promoInfo ? `Code promo utilisé: Oui (réduction de ${promoInfo.discount} FCFA)` : 'Code promo utilisé: Non'}
Date de demande: ${new Date().toLocaleString('fr-FR')}
Statut: DEMANDE DE RÉCUPÉRATION CONFIRMÉE`;

    const { error: updateError } = await supabaseClient
      .from("reported_cards")
      .update({ 
        description: updatedDescription,
        status: "recovery_requested" 
      })
      .eq("id", cardId);

    if (updateError) {
      console.error("❌ Erreur lors de la mise à jour de la carte:", updateError);
      throw updateError;
    }

    console.log("✅ Description de la carte mise à jour");

    let promoDetails = null;
    let promoOwnerInfo = null;
    if (promoInfo) {
      console.log("🎫 Traitement du code promo...");
      
      promoDetails = await fetchPromoData(supabaseClient, promoInfo.promoCodeId);
      
      if (promoDetails) {
        promoOwnerInfo = promoDetails.profiles;
        
        await recordPromoUsage(
          supabaseClient,
          promoInfo.promoCodeId,
          ownerInfo.phone,
          promoInfo.discount
        );

        if (promoDetails.user_id) {
          const { error: notificationError } = await supabaseClient
            .from("notifications")
            .insert({
              user_id: promoDetails.user_id,
              type: "promo_code_used",
              title: "🎉 Code promo utilisé !",
              message: `Votre code promo ${promoDetails.code} vient d'être utilisé ! Attendez la confirmation de récupération pour recevoir votre revenu de 1000 FCFA.`,
              is_read: false
            });
          
          if (notificationError) {
            console.error("⚠️ Erreur notification propriétaire code promo:", notificationError);
          } else {
            console.log("✅ Notification envoyée au propriétaire du code promo:", promoDetails.user_id);
          }
        }
      } else {
        console.log("⚠️ Code promo introuvable dans la base de données");
      }
    }

    console.log("📧 Génération du contenu de l'email...");
    const emailContent = generateEmailContent({
      cardData,
      ownerInfo,
      promoDetails,
      promoOwnerInfo,
      promoInfo
    });

    const subject = `🔍 Demande de récupération - Carte ${cardData.card_number}${promoDetails ? ` (Code promo: ${promoDetails.code})` : ''}`;

    console.log("📤 Envoi de l'email...");
    const emailResponse = await sendRecoveryEmail(subject, emailContent);

    if (emailResponse.id) {
      console.log("✅ Email envoyé avec succès - ID:", emailResponse.id);
    }

    console.log("🎉 Traitement de la demande de récupération terminé avec succès");

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.id,
        message: "Demande de récupération envoyée avec succès",
        cardNumber: cardData.card_number,
        finalPrice: finalPrice,
        promoUsed: !!promoInfo
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("❌ Erreur dans send-recovery-notification:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erreur interne du serveur",
        details: "Une erreur est survenue lors du traitement de votre demande"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
