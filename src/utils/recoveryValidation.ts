
export const isValidRecoveryRequest = (description: string, status: string): boolean => {
  console.log("🔍 Validation d'une demande de récupération:");
  console.log("📝 Description:", description ? description.substring(0, 200) + "..." : "Aucune");
  console.log("📊 Statut:", status);
  
  // Première vérification : si le statut est 'recovery_requested', c'est automatiquement valide
  if (status === 'recovery_requested') {
    console.log("✅ Demande valide - statut recovery_requested");
    return true;
  }
  
  // Si pas de description, on ne peut pas valider
  if (!description) {
    console.log("❌ Pas de description disponible");
    return false;
  }
  
  // Chercher les mots-clés spécifiques dans la description (insensible à la casse)
  const recoveryKeywords = [
    "INFORMATIONS DE RÉCUPÉRATION",
    "DEMANDE DE RÉCUPÉRATION",
    "Nom du propriétaire:",
    "Prix final:",
    "Prix à payer:",
    "RÉCUPÉRATION CONFIRMÉE",
    "DEMANDE DE RÉCUPÉRATION CONFIRMÉE",
    "Date de demande:",
    "Statut: DEMANDE DE RÉCUPÉRATION CONFIRMÉE"
  ];
  
  const descriptionUpper = description.toUpperCase();
  const hasRecoveryKeywords = recoveryKeywords.some(keyword => 
    descriptionUpper.includes(keyword.toUpperCase())
  );
  
  console.log("🔍 Mots-clés trouvés:", hasRecoveryKeywords);
  console.log("🔍 Description contient:", {
    hasInfoRecuperation: descriptionUpper.includes("INFORMATIONS DE RÉCUPÉRATION"),
    hasNomProprietaire: descriptionUpper.includes("NOM DU PROPRIÉTAIRE"),
    hasPrixFinal: descriptionUpper.includes("PRIX FINAL"),
    hasDateDemande: descriptionUpper.includes("DATE DE DEMANDE")
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

  // Extraction du nom du propriétaire
  const ownerNameMatch = description.match(/Nom du propriétaire:\s*([^\n\r]+)/i);
  // Extraction du téléphone
  const ownerPhoneMatch = description.match(/Téléphone:\s*([^\n\r]+)/i);
  // Extraction du prix final
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
