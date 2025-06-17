
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type MCard = Tables<'mcards'> & {
  view_count?: number;
};

export type MCardCreateData = TablesInsert<'mcards'>;
export type MCardUpdateData = TablesUpdate<'mcards'>;

export interface MCardFormOptions {
  silent?: boolean;
}
