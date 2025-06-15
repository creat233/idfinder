
import { Json } from "@/integrations/supabase/types";

export interface AuditLog {
  id: string;
  created_at: string;
  user_email: string | null;
  action: string;
  details: Json | null;
  ip_address: string | null;
}
