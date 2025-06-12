
export interface AdminPromoDataResponse {
  id: string;
  user_id: string;
  code: string;
  is_active: boolean;
  is_paid: boolean;
  created_at: string;
  expires_at: string;
  total_earnings: number;
  usage_count: number;
  user_email: string;
  user_name: string;
  user_phone: string;
}

export interface AdminPromoStats {
  totalCodes: number;
  activeCodes: number;
  totalUsage: number;
  totalEarnings: number;
}
