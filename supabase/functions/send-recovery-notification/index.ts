
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface RecoveryNotificationRequest {
  cardId: string;
  ownerInfo: {
    name: string;
    phone: string;
  };
  promoInfo?: {
    promoCodeId: string;
    discount: number;
    finalPrice: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { cardId, ownerInfo, promoInfo }: RecoveryNotificationRequest = await req.json();

    console.log("Processing recovery notification for card:", cardId);

    // Récupérer les informations de la carte et du signaleur
    const { data: cardData, error: cardError } = await supabaseClient
      .from("reported_cards")
      .select(`
        *,
        profiles!reported_cards_reporter_id_fkey (
          first_name,
          last_name,
          phone
        )
      `)
      .eq("id", cardId)
      .single();

    if (cardError) {
      console.error("Error fetching card data:", cardError);
      throw cardError;
    }

    if (!cardData) {
      throw new Error("Card not found");
    }

    // Si un code promo est utilisé, récupérer ses informations et enregistrer l'utilisation
    let promoDetails = null;
    if (promoInfo) {
      const { data: promoData, error: promoError } = await supabaseClient
        .from("promo_codes")
        .select("code, user_id")
        .eq("id", promoInfo.promoCodeId)
        .single();

      if (!promoError && promoData) {
        promoDetails = promoData;
        
        // Enregistrer l'utilisation du code promo
        await supabaseClient.from("promo_usage").insert({
          promo_code_id: promoInfo.promoCodeId,
          used_by_email: null, // Pas d'email car c'est une récupération
          used_by_phone: ownerInfo.phone,
          discount_amount: promoInfo.discount,
        });
      }
    }

    // Fonction pour obtenir le type de document en français
    const getDocumentTypeLabel = (type: string) => {
      const types: Record<string, string> = {
        id: "Carte d'identité nationale",
        driver_license: "Permis de conduire",
        passport: "Passeport",
        vehicle_registration: "Carte grise véhicule",
        motorcycle_registration: "Carte grise moto",
        residence_permit: "Carte de séjour",
        student_card: "Carte étudiante",
      };
      return types[type] || type;
    };

    // Préparer l'email avec les informations du code promo si applicable
    let promoSection = "";
    if (promoDetails) {
      promoSection = `
      <h3>💰 Code promo utilisé</h3>
      <ul>
        <li><strong>Code promo:</strong> ${promoDetails.code}</li>
        <li><strong>Réduction appliquée:</strong> ${promoInfo!.discount} FCFA</li>
        <li><strong>Prix original:</strong> 7000 FCFA</li>
        <li><strong>Prix final:</strong> ${promoInfo!.finalPrice} FCFA</li>
      </ul>
      `;
    }

    const emailContent = `
      <h2>🔍 Nouvelle demande de récupération - FinderID</h2>
      
      <h3>📋 Informations de la carte</h3>
      <ul>
        <li><strong>Numéro de carte:</strong> ${cardData.card_number}</li>
        <li><strong>Type de document:</strong> ${getDocumentTypeLabel(cardData.document_type)}</li>
        <li><strong>Lieu de découverte:</strong> ${cardData.location}</li>
        <li><strong>Date de découverte:</strong> ${new Date(cardData.found_date).toLocaleDateString("fr-FR")}</li>
        ${cardData.description ? `<li><strong>Description:</strong> ${cardData.description}</li>` : ''}
      </ul>

      <h3>👤 Informations du propriétaire (demandeur)</h3>
      <ul>
        <li><strong>Nom:</strong> ${ownerInfo.name}</li>
        <li><strong>Téléphone:</strong> ${ownerInfo.phone}</li>
      </ul>

      <h3>🔍 Informations du découvreur</h3>
      <ul>
        <li><strong>Nom:</strong> ${cardData.profiles?.first_name || 'Non renseigné'} ${cardData.profiles?.last_name || ''}</li>
        <li><strong>Téléphone:</strong> ${cardData.profiles?.phone || cardData.reporter_phone || 'Non renseigné'}</li>
      </ul>

      ${promoSection}

      <h3>💳 Récapitulatif financier</h3>
      <ul>
        <li><strong>Frais de récupération:</strong> ${promoInfo ? promoInfo.finalPrice : 7000} FCFA</li>
        ${promoInfo ? `<li><strong>Économies réalisées:</strong> ${promoInfo.discount} FCFA</li>` : ''}
        <li><strong>Livraison:</strong> Si applicable (frais supplémentaires)</li>
      </ul>

      <hr>
      <p><em>Email automatique généré par FinderID - ${new Date().toLocaleString("fr-FR")}</em></p>
    `;

    // Envoyer l'email
    const emailResponse = await resend.emails.send({
      from: "FinderID <notifications@resend.dev>",
      to: ["idfinder06@gmail.com"],
      subject: `🔍 Demande de récupération - Carte ${cardData.card_number}${promoDetails ? ` (Code promo: ${promoDetails.code})` : ''}`,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    // Optionnel: Mettre à jour le statut de la carte
    await supabaseClient
      .from("reported_cards")
      .update({ status: "recovery_requested" })
      .eq("id", cardId);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.id }),
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
