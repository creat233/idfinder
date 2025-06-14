export const isValidRecoveryRequest = (description: string, status: string): boolean => {
  // Vérifier d'abord si c'est une demande de récupération basée sur le statut
  const isRecoveryStatus = status === 'recovery_requested';
  
  // Vérifier si la description contient les informations nécessaires
  const hasOwnerInfo = description && (
    description.includes("Nom du propriétaire:") || 
    description.includes("INFORMATIONS DE RÉCUPÉRATION") ||
    description.includes("DEMANDE DE RÉCUPÉRATION")
  );
  
  const hasRecoveryRequest = description && (
    description.includes("Prix final:") || 
    description.includes("Prix à payer:") ||
    description.includes("DEMANDE DE RÉCUPÉRATION") ||
    description.includes("INFORMATIONS DE RÉCUPÉRATION")
  );

  // La condition principale est le statut, sinon on vérifie la description
  const isValid = isRecoveryStatus || (hasOwnerInfo && hasRecoveryRequest);

  console.log("🔍 Validation demande récupération:", {
    carte: description?.substring(0, 50) + "...",
    statut: status,
    isRecoveryStatus,
    hasOwnerInfo,
    hasRecoveryRequest,
    isValid
  });

  return isValid;
};

export const extractOwnerInfo = (description: string) => {
  if (!description) {
    return {
      ownerName: "Propriétaire non renseigné",
      ownerPhone: "Non renseigné",
      finalPrice: 7000
    };
  }

  const ownerNameMatch = description.match(/Nom du propriétaire:\s*([^\n\r]+)/i);
  const ownerPhoneMatch = description.match(/Téléphone:\s*([^\n\r]+)/i);
  const finalPriceMatch = description.match(/Prix (?:final|à payer):\s*(\d+)\s*FCFA/i);

  const ownerName = ownerNameMatch ? ownerNameMatch[1].trim() : "Propriétaire non renseigné";
  const ownerPhone = ownerPhoneMatch ? ownerPhoneMatch[1].trim() : "Non renseigné";
  const finalPrice = finalPriceMatch ? parseInt(finalPriceMatch[1]) : 7000;

  console.log("📋 Informations extraites:", {
    ownerName,
    ownerPhone,
    finalPrice
  });

  return {
    ownerName,
    ownerPhone,
    finalPrice
  };
};

export const hasPromoCodeUsed = (description: string): boolean => {
  if (!description) return false;
  const hasPromoCode = description.match(/Code promo utilisé:\s*Oui.*?réduction de (\d+)\s*FCFA/is) !== null;
  console.log("🎁 Code promo utilisé:", hasPromoCode);
  return hasPromoCode;
};

export const extractPromoDiscount = (description: string): number | null => {
  if (!description) return null;
  const promoUsedMatch = description.match(/Code promo utilisé:\s*Oui.*?réduction de (\d+)\s*FCFA/is);
  const discount = promoUsedMatch ? parseInt(promoUsedMatch[1]) : null;
  console.log("💰 Réduction code promo:", discount);
  return discount;
};
