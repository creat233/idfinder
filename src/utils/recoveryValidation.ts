
export const isValidRecoveryRequest = (description: string, status: string): boolean => {
  const hasOwnerInfo = description.includes("Nom du propriétaire:") && 
                      description.includes("Téléphone:");
  const hasRecoveryRequest = description.includes("Prix final:") || 
                            description.includes("Prix à payer:");
  const isRecoveryStatus = status === 'recovery_requested';

  return hasOwnerInfo && (hasRecoveryRequest || isRecoveryStatus);
};

export const extractOwnerInfo = (description: string) => {
  const ownerNameMatch = description.match(/Nom du propriétaire:\s*([^\n\r]+)/i);
  const ownerPhoneMatch = description.match(/Téléphone:\s*([^\n\r]+)/i);
  const finalPriceMatch = description.match(/Prix (?:final|à payer):\s*(\d+)\s*FCFA/i);

  return {
    ownerName: ownerNameMatch ? ownerNameMatch[1].trim() : "Propriétaire non renseigné",
    ownerPhone: ownerPhoneMatch ? ownerPhoneMatch[1].trim() : "Non renseigné",
    finalPrice: finalPriceMatch ? parseInt(finalPriceMatch[1]) : 7000
  };
};

export const hasPromoCodeUsed = (description: string): boolean => {
  return description.match(/Code promo utilisé:\s*Oui.*?réduction de (\d+)\s*FCFA/is) !== null;
};

export const extractPromoDiscount = (description: string): number | null => {
  const promoUsedMatch = description.match(/Code promo utilisé:\s*Oui.*?réduction de (\d+)\s*FCFA/is);
  return promoUsedMatch ? parseInt(promoUsedMatch[1]) : null;
};
