export interface AllRecoveryData {
  id: string;
  card_id: string;
  card_number: string;
  document_type: string;
  location: string;
  owner_name: string;
  owner_phone: string;
  reporter_name: string;
  reporter_phone: string;
  reporter_id: string;
  final_price: number;
  promo_code?: string;
  promo_code_id?: string; // <- on ajoute promo_code_id pour edit/associer le code promo côté admin
  promo_code_owner_id?: string;
  promo_code_owner_phone?: string;
  promo_usage_id?: string;
  discount_amount?: number;
  created_at: string;
  status: string;
}

export interface ReportedCard {
  id: string;
  card_number: string;
  document_type: string;
  location: string;
  description: string | null;
  status: string;
  reporter_id: string;
  reporter_phone?: string;
  created_at: string;
}

export interface ReporterProfile {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface PromoUsage {
  id: string;
  discount_amount: number;
  promo_codes: {
    code: string;
    user_id: string;
  } | null;
}
