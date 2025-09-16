export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Invoice {
  id: string;
  mcard_id: string;
  invoice_number: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  amount: number;
  currency: string;
  status: string;
  due_date?: string;
  issued_date?: string;
  paid_date?: string;
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: InvoiceItem[];
}

export interface InvoiceCreateData {
  mcard_id: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  due_date?: string;
  description?: string;
  notes?: string;
  items: { description: string; quantity: number; unit_price: number; }[];
}

export interface InvoiceStats {
  total_invoices: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
}

export interface InvoiceAnalytics {
  period: string;
  total_amount: number;
  invoice_count: number;
  paid_count: number;
}