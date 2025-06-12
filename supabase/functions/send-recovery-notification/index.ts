
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
    const { cardId, ownerInfo, promoInfo }: RecoveryNotificationRequest = await req.json();

    console.log("Processing recovery notification for card:", cardId);

    // Récupérer les informations de la carte et du signaleur
    const cardData = await fetchCardData(supabaseClient, cardId);

    // Mettre à jour la description de la carte avec les informations du propriétaire
    const finalPrice = promoInfo ? promoInfo.finalPrice : 7000;
    const updatedDescription = `${cardData.description || ''}

--- INFORMATIONS DE RÉCUPÉRATION ---
Nom du propriétaire: ${ownerInfo.name}
Téléphone: ${ownerInfo.phone}
Prix final: ${finalPrice} FCFA
${promoInfo ? `Code promo utilisé: Oui (réduction de ${promoInfo.discount} FCFA)` : 'Code promo utilisé: Non'}
Date de demande: ${new Date().toLocaleString('fr-FR')}`;

    // Mettre à jour la carte avec ces informations
    await supabaseClient
      .from("reported_cards")
      .update({ 
        description: updatedDescription,
        status: "recovery_requested" 
      })
      .eq("id", cardId);

    // Si un code promo est utilisé, récupérer ses informations et enregistrer l'utilisation
    let promoDetails = null;
    let promoOwnerInfo = null;
    if (promoInfo) {
      promoDetails = await fetchPromoData(supabaseClient, promoInfo.promoCodeId);
      
      if (promoDetails) {
        promoOwnerInfo = promoDetails.profiles;
        
        // Enregistrer l'utilisation du code promo
        await recordPromoUsage(
          supabaseClient,
          promoInfo.promoCodeId,
          ownerInfo.phone,
          promoInfo.discount
        );

        // Notifier le propriétaire du code promo que son code a été utilisé
        if (promoDetails.user_id) {
          await supabaseClient
            .from("notifications")
            .insert({
              user_id: promoDetails.user_id,
              type: "promo_code_used",
              title: "🎉 Code promo utilisé !",
              message: `Votre code promo ${promoDetails.code} vient d'être utilisé ! Attendez la confirmation de récupération pour recevoir votre revenu de 1000 FCFA.`,
              is_read: false
            });
          
          console.log("Notification envoyée au propriétaire du code promo:", promoDetails.user_id);
        }
      }
    }

    // Générer le contenu de l'email
    const emailContent = generateEmailContent({
      cardData,
      ownerInfo,
      promoDetails,
      promoOwnerInfo,
      promoInfo
    });

    // Créer le sujet de l'email
    const subject = `🔍 Demande de récupération - Carte ${cardData.card_number}${promoDetails ? ` (Code promo: ${promoDetails.code})` : ''}`;

    // Envoyer l'email
    const emailResponse = await sendRecoveryEmail(subject, emailContent);

    console.log("Recovery notification processed successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.id,
        message: "Demande de récupération envoyée avec succès"
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
    console.error("Error in send-recovery-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Une erreur est survenue lors de l'envoi de la demande de récupération"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
