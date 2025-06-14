
import { AllRecoveryData, ReportedCard } from "@/types/adminRecoveries";
import { isValidRecoveryRequest, extractOwnerInfo, hasPromoCodeUsed, extractPromoDiscount } from "@/utils/recoveryValidation";
import { fetchReporterProfile, fetchPromoUsage, fetchPromoOwnerPhone } from "./adminRecoveryService";

export const processReportedCard = async (card: ReportedCard): Promise<AllRecoveryData | null> => {
  console.log("🔍 Analyse de la carte:", card.card_number);
  console.log("📊 Statut de la carte:", card.status);
  console.log("📝 Description présente:", !!card.description);
  console.log("📄 Description complète:", card.description?.substring(0, 300));
  
  const description = card.description || "";
  
  // Vérifier si c'est une demande de récupération valide
  const isValid = isValidRecoveryRequest(description, card.status);
  
  // Pour le debug, traiter toutes les cartes qui ne sont pas en statut 'pending' par défaut
  const shouldProcess = isValid || (card.status && card.status !== 'pending') || description.length > 0;
  
  if (!shouldProcess) {
    console.log("❌ Carte ignorée - pas une demande de récupération");
    return null;
  }

  console.log("✅ TRAITEMENT DE LA CARTE:", card.card_number);

  try {
    // Récupérer le profil du signaleur
    const reporterProfile = await fetchReporterProfile(card.reporter_id);

    // Extraire les informations depuis la description
    const { ownerName, ownerPhone, finalPrice } = extractOwnerInfo(description);

    // Traiter les informations de code promo si présentes
    let promoData = null;
    if (hasPromoCodeUsed(description) && ownerPhone !== "Non renseigné") {
      console.log("🎁 Code promo détecté, recherche des détails...");
      const discountAmount = extractPromoDiscount(description);
      
      const promoUsage = await fetchPromoUsage(ownerPhone);
      if (promoUsage && promoUsage.promo_codes) {
        const promoCodeOwnerPhone = await fetchPromoOwnerPhone(promoUsage.promo_codes.user_id);
        
        promoData = {
          promoCode: promoUsage.promo_codes.code,
          promoCodeOwnerId: promoUsage.promo_codes.user_id,
          promoCodeOwnerPhone,
          promoUsageId: promoUsage.id,
          discountAmount: promoUsage.discount_amount
        };
        
        console.log("🎫 Code promo trouvé:", promoData.promoCode);
      }
    }

    // Informations du signaleur
    const reporterName = reporterProfile 
      ? `${reporterProfile.first_name || ''} ${reporterProfile.last_name || ''}`.trim()
      : "Signaleur non renseigné";
    const reporterPhone = reporterProfile?.phone || card.reporter_phone || "Non renseigné";

    // Déterminer le statut final
    let finalStatus = card.status || "recovery_requested";
    if (finalStatus === 'pending' && (isValid || description.length > 0)) {
      finalStatus = "recovery_requested";
    }

    const recovery: AllRecoveryData = {
      id: card.id,
      card_id: card.id,
      card_number: card.card_number,
      document_type: card.document_type,
      location: card.location,
      owner_name: ownerName,
      owner_phone: ownerPhone,
      reporter_name: reporterName,
      reporter_phone: reporterPhone,
      reporter_id: card.reporter_id,
      final_price: finalPrice,
      created_at: card.created_at,
      status: finalStatus,
      promo_code: promoData?.promoCode,
      promo_code_owner_id: promoData?.promoCodeOwnerId,
      promo_code_owner_phone: promoData?.promoCodeOwnerPhone,
      promo_usage_id: promoData?.promoUsageId,
      discount_amount: promoData?.discountAmount
    };

    console.log("✅ RÉCUPÉRATION CRÉÉE AVEC SUCCÈS:", {
      carte: recovery.card_number,
      propriétaire: recovery.owner_name,
      téléphone: recovery.owner_phone,
      prix: recovery.final_price,
      statut: recovery.status,
      isValidRecovery: isValid
    });

    return recovery;
  } catch (error) {
    console.error("❌ Erreur lors du traitement de la carte:", card.card_number, error);
    return null;
  }
};
