
import { CardData, PromoData, PriceInfo } from "./types.ts";
import { getDocumentTypeLabel } from "./utils.ts";

interface EmailTemplateProps {
  cardData: CardData;
  ownerInfo: {
    name: string;
    phone: string;
  };
  promoDetails?: PromoData;
  promoOwnerInfo?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  promoInfo?: {
    discount: number;
    finalPrice: number;
  };
  priceInfo: PriceInfo;
}

export const generateEmailContent = ({
  cardData,
  ownerInfo,
  promoDetails,
  promoOwnerInfo,
  promoInfo,
  priceInfo,
}: EmailTemplateProps): string => {
  // Préparer la section code promo si applicable
  let promoSection = "";
  if (promoDetails && promoOwnerInfo && promoInfo) {
    const promoOwnerName = `${promoOwnerInfo.first_name || 'Non renseigné'} ${promoOwnerInfo.last_name || ''}`.trim();
    const promoOwnerPhone = promoOwnerInfo.phone || 'Non renseigné';
    
    promoSection = `
    <h3 style="color: #16a34a; margin: 20px 0 10px 0;">💰 Code promo utilisé</h3>
    <ul style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
      <li><strong>Code promo:</strong> <span style="font-family: monospace; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">${promoDetails.code}</span></li>
      <li><strong>Réduction appliquée:</strong> ${promoInfo.discount} ${priceInfo.symbol}</li>
      <li><strong>Prix original:</strong> ${priceInfo.baseFee} ${priceInfo.symbol}</li>
      <li><strong>Prix final:</strong> <span style="font-weight: bold; color: #16a34a;">${promoInfo.finalPrice} ${priceInfo.symbol}</span></li>
    </ul>
    
    <h3 style="color: #7c3aed; margin: 20px 0 10px 0;">👤 Propriétaire du code promo (À PAYER - 1000 FCFA)</h3>
    <ul style="background: #faf5ff; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed;">
      <li><strong>Nom:</strong> ${promoOwnerName}</li>
      <li><strong>Téléphone:</strong> <a href="tel:${promoOwnerPhone}" style="color: #7c3aed; text-decoration: none; font-weight: bold; font-size: 16px;">${promoOwnerPhone}</a></li>
      <li><strong>Montant à payer:</strong> <span style="font-weight: bold; color: #16a34a; font-size: 18px;">1000 FCFA</span></li>
      <li><strong>Code utilisé:</strong> <span style="font-family: monospace; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">${promoDetails.code}</span></li>
    </ul>
    `;
  }

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #1f2937; margin: 0 0 10px 0;">🔍 Nouvelle demande de récupération - FinderID</h2>
        <p style="color: #6b7280; margin: 0;">Demande reçue le ${new Date().toLocaleDateString("fr-FR", { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
    
      <h3 style="color: #1f2937; margin: 20px 0 10px 0;">📋 Informations de la carte</h3>
      <ul style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <li><strong>Numéro de carte:</strong> <span style="font-family: monospace; background: #dbeafe; padding: 2px 6px; border-radius: 4px;">${cardData.card_number}</span></li>
        <li><strong>Type de document:</strong> ${getDocumentTypeLabel(cardData.document_type)}</li>
        <li><strong>Lieu de découverte:</strong> ${cardData.location}</li>
        <li><strong>Date de découverte:</strong> ${new Date(cardData.found_date).toLocaleDateString("fr-FR")}</li>
        ${cardData.description ? `<li><strong>Description:</strong> ${cardData.description}</li>` : ''}
      </ul>

      <h3 style="color: #16a34a; margin: 20px 0 10px 0;">👤 Propriétaire de la carte (demandeur)</h3>
      <ul style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
        <li><strong>Nom complet:</strong> ${ownerInfo.name}</li>
        <li><strong>Téléphone:</strong> <a href="tel:${ownerInfo.phone}" style="color: #16a34a; text-decoration: none;">${ownerInfo.phone}</a></li>
      </ul>

      <h3 style="color: #dc2626; margin: 20px 0 10px 0;">🔍 Signaleur de la carte (À PAYER - 2000 FCFA)</h3>
      <ul style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
        <li><strong>Nom:</strong> ${cardData.profiles?.first_name || 'Non renseigné'} ${cardData.profiles?.last_name || ''}</li>
        <li><strong>Téléphone:</strong> <a href="tel:${cardData.profiles?.phone || cardData.reporter_phone || 'Non renseigné'}" style="color: #dc2626; text-decoration: none; font-weight: bold; font-size: 16px;">${cardData.profiles?.phone || cardData.reporter_phone || 'Non renseigné'}</a></li>
        <li><strong>Récompense due:</strong> <span style="font-weight: bold; color: #16a34a; font-size: 18px;">2000 FCFA</span></li>
      </ul>

      ${promoSection}

      <h3 style="color: #1f2937; margin: 20px 0 10px 0;">💳 Récapitulatif des paiements à effectuer</h3>
      <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 2px solid #e5e7eb;">
        <ul style="margin: 0;">
          <li style="margin-bottom: 8px;"><strong>🔸 Propriétaire (récupération):</strong> <span style="font-size: 18px; font-weight: bold; color: #1f2937;">${priceInfo.finalPrice} ${priceInfo.symbol}</span></li>
          <li style="margin-bottom: 8px;"><strong>🔸 Signaleur (récompense):</strong> <span style="color: #dc2626; font-weight: bold; font-size: 16px;">2000 FCFA</span></li>
          ${promoOwnerInfo ? `<li style="margin-bottom: 8px;"><strong>🔸 Propriétaire code promo:</strong> <span style="color: #7c3aed; font-weight: bold; font-size: 16px;">1000 FCFA</span></li>` : ''}
          ${promoInfo ? `<li style="margin-bottom: 8px;"><strong>💰 Économies client:</strong> <span style="color: #16a34a; font-weight: bold;">-${promoInfo.discount} ${priceInfo.symbol}</span></li>` : ''}
        </ul>
      </div>

      <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 12px;">
          <em>Email automatique généré par FinderID - ${new Date().toLocaleString("fr-FR")}</em>
        </p>
      </div>
    </div>
  `;
};
