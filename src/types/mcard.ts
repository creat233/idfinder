
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type MCard = Tables<'mcards'> & {
  view_count?: number;
  price?: number;
  is_verified?: boolean;
  verification_status?: string;
};

export type MCardCreateData = TablesInsert<'mcards'>;
export type MCardUpdateData = TablesUpdate<'mcards'>;

export type MCardStatus = {
  id: string;
  mcard_id: string;
  status_text: string;
  status_color: string;
  status_image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
};

export type MCardProduct = {
  id: string;
  mcard_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  category: string;
  image_url: string | null;
  is_active: boolean;
  is_pinned?: boolean;
  created_at: string;
  updated_at: string;
};

export type MCardReview = {
  id: string;
  mcard_id: string;
  visitor_name: string;
  visitor_email?: string;
  rating: number;
  comment?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
};

export interface MCardFormOptions {
  silent?: boolean;
}
