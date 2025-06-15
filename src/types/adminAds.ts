
export interface AdminAd {
  id: string;
  title: string;
  message: string | null;
  image_url: string | null;
  target_url: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}
