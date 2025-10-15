export interface QuoteItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Quote {
  id: string;
  mcard_id: string;
  quote_number: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  amount: number;
  currency: string;
  status: string;
  valid_until?: string;
  issued_date?: string;
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: QuoteItem[];
}

export interface QuoteCreateData {
  mcard_id: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  valid_until?: string;
  description?: string;
  notes?: string;
  currency?: string;
  items: { description: string; quantity: number; unit_price: number; }[];
}
