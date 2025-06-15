
export interface AuditLog {
  id: string;
  created_at: string;
  user_email: string | null;
  action: string;
  details: Record<string, any> | null;
  ip_address: string | null;
}
