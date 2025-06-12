
export interface RecoveryNotificationRequest {
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

export interface CardData {
  id: string;
  card_number: string;
  document_type: string;
  location: string;
  found_date: string;
  description?: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  reporter_phone?: string;
}

export interface PromoData {
  code: string;
  user_id: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
}
