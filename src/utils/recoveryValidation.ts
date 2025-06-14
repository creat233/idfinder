
export const isValidRecoveryRequest = (description: string, status: string): boolean => {
  console.log("🔍 Validation d'une demande de récupération:");
  console.log("📝 Description:", description?.substring(0, 200));
  console.log("📊 Statut:", status);
  
  // Si le statut indique une demande de récupération, c'est valide
  if (status === 'recovery_requested') {
    console.log("✅ Demande valide - statut recovery_requested");
    return true;
  }
  
  // Sinon, vérifier si la description contient les informations de récupération
  if (!description) {
    console.log("❌ Pas de description disponible");
    return false;
  }
  
  // Chercher des mots-clés spécifiques dans la description
  const recoveryKeywords = [
    "INFORMATIONS DE RÉCUPÉRATION",
    "DEMANDE DE RÉCUPÉRATION",
    "Nom du propriétaire:",
    "Prix final:",
    "Prix à payer:",
    "RÉCUPÉRATION CONFIRMÉE",
    "DEMANDE DE RÉCUPÉRATION CONFIRMÉE"
  ];
  
  const hasRecoveryKeywords = recoveryKeywords.some(keyword => 
    description.toUpperCase().includes(keyword.toUpperCase())
  );
  
  console.log("🔍 Résultat validation:", {
    hasRecoveryKeywords,
    isValid: hasRecoveryKeywords
  });

  return hasRecoveryKeywords;
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
