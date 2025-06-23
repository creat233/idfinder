
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type MCard = Tables<'mcards'> & {
  view_count?: number;
};

export type MCardCreateData = TablesInsert<'mcards'>;
export type MCardUpdateData = TablesUpdate<'mcards'>;

export type MCardStatus = {
  id: string;
  mcard_id: string;
  status_text: string;
  status_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
};

export interface MCardFormOptions {
  silent?: boolean;
}
