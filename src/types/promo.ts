
export interface PromoCodeData {
  id: string;
  code: string;
  is_active: boolean;
  is_paid: boolean;
  created_at: string;
  expires_at: string;
  total_earnings: number;
  usage_count: number;
  user_id: string;
  user_email: string;
  user_name: string;
  user_phone: string;
}

export interface PromoCodeStats {
  totalCodes: number;
  activeCodes: number;
  totalUsage: number;
  totalEarnings: number;
}
