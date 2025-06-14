
import { AllRecoveryData, ReportedCard, ReporterProfile } from "@/types/adminRecoveries";
import { isValidRecoveryRequest, extractOwnerInfo, hasPromoCodeUsed, extractPromoDiscount } from "@/utils/recoveryValidation";
import { fetchReporterProfile, fetchPromoUsage, fetchPromoOwnerPhone } from "./adminRecoveryService";

export const processReportedCard = async (card: ReportedCard): Promise<AllRecoveryData | null> => {
  console.log("🔍 Analyse de la carte:", card.card_number);
  console.log("📝 Description:", card.description);
  console.log("📊 Statut:", card.status);
  
  const description = card.description || "";
  
  if (!isValidRecoveryRequest(description, card.status)) {
    console.log("❌ Carte ignorée - pas une demande de récupération valide");
    return null;
  }

  console.log("✅ Demande de récupération valide détectée");

  // Récupérer le profil du signaleur
  const reporterProfile = await fetchReporterProfile(card.reporter_id);

  // Extraire les informations depuis la description
  const { ownerName, ownerPhone, finalPrice } = extractOwnerInfo(description);

  // Traiter les informations de code promo
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

  console.log("👨‍💼 Signaleur:", reporterName, "-", reporterPhone);

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
    status: card.status || "pending",
    promo_code: promoData?.promoCode,
    promo_code_owner_id: promoData?.promoCodeOwnerId,
    promo_code_owner_phone: promoData?.promoCodeOwnerPhone,
    promo_usage_id: promoData?.promoUsageId,
    discount_amount: promoData?.discountAmount
  };

  console.log("✅ Demande de récupération ajoutée:", {
    carte: recovery.card_number,
    propriétaire: recovery.owner_name,
    signaleur: recovery.reporter_name,
    prix: recovery.final_price,
    promo: recovery.promo_code
  });

  return recovery;
};
