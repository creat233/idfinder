
import { CardData, PromoData } from "./types.ts";
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
}

export const generateEmailContent = ({
  cardData,
  ownerInfo,
  promoDetails,
  promoOwnerInfo,
  promoInfo
}: EmailTemplateProps): string => {
  // Préparer la section code promo si applicable
  let promoSection = "";
  if (promoDetails && promoOwnerInfo && promoInfo) {
    promoSection = `
    <h3>💰 Code promo utilisé</h3>
    <ul>
      <li><strong>Code promo:</strong> ${promoDetails.code}</li>
      <li><strong>Réduction appliquée:</strong> ${promoInfo.discount} FCFA</li>
      <li><strong>Prix original:</strong> 7000 FCFA</li>
      <li><strong>Prix final:</strong> ${promoInfo.finalPrice} FCFA</li>
    </ul>
    
    <h3>👤 Propriétaire du code promo</h3>
    <ul>
      <li><strong>Nom:</strong> ${promoOwnerInfo.first_name || 'Non renseigné'} ${promoOwnerInfo.last_name || ''}</li>
      <li><strong>Téléphone:</strong> ${promoOwnerInfo.phone || 'Non renseigné'}</li>
      <li><strong>Montant à payer au propriétaire:</strong> 1000 FCFA</li>
    </ul>
    `;
  }

  return `
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
      ${promoOwnerInfo ? `<li><strong>Commission pour le propriétaire du code promo:</strong> 1000 FCFA</li>` : ''}
      <li><strong>Livraison:</strong> Si applicable (frais supplémentaires)</li>
    </ul>

    <hr>
    <p><em>Email automatique généré par FinderID - ${new Date().toLocaleString("fr-FR")}</em></p>
  `;
};
