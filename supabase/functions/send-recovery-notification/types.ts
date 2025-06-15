
export interface PriceInfo {
  baseFee: number;
  finalPrice: number;
  currency: string;
  symbol: string;
}

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
  priceInfo: PriceInfo;
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
  recovery_base_fee?: number;
  recovery_final_price?: number;
  recovery_currency?: string;
  recovery_currency_symbol?: string;
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
