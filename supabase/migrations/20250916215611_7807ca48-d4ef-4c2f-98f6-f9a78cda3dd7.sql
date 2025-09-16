-- Table pour les factures MCard
CREATE TABLE public.mcard_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mcard_id UUID NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  status TEXT NOT NULL DEFAULT 'draft',
  due_date DATE,
  issued_date DATE DEFAULT CURRENT_DATE,
  paid_date DATE,
  description TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les lignes de facture
CREATE TABLE public.mcard_invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.mcard_invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mcard_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcard_invoice_items ENABLE ROW LEVEL SECURITY;

-- Policies pour mcard_invoices
CREATE POLICY "Users can view invoices for their own mcards" 
ON public.mcard_invoices 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.mcards 
  WHERE mcards.id = mcard_invoices.mcard_id 
  AND mcards.user_id = auth.uid()
));

CREATE POLICY "Users can create invoices for their own mcards" 
ON public.mcard_invoices 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.mcards 
  WHERE mcards.id = mcard_invoices.mcard_id 
  AND mcards.user_id = auth.uid()
  AND mcards.plan IN ('essential', 'premium')
));

CREATE POLICY "Users can update invoices for their own mcards" 
ON public.mcard_invoices 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.mcards 
  WHERE mcards.id = mcard_invoices.mcard_id 
  AND mcards.user_id = auth.uid()
));

CREATE POLICY "Users can delete invoices for their own mcards" 
ON public.mcard_invoices 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.mcards 
  WHERE mcards.id = mcard_invoices.mcard_id 
  AND mcards.user_id = auth.uid()
));

-- Policies pour mcard_invoice_items
CREATE POLICY "Users can view invoice items for their own mcards" 
ON public.mcard_invoice_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.mcard_invoices mi
  JOIN public.mcards m ON m.id = mi.mcard_id
  WHERE mi.id = mcard_invoice_items.invoice_id 
  AND m.user_id = auth.uid()
));

CREATE POLICY "Users can create invoice items for their own mcards" 
ON public.mcard_invoice_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.mcard_invoices mi
  JOIN public.mcards m ON m.id = mi.mcard_id
  WHERE mi.id = mcard_invoice_items.invoice_id 
  AND m.user_id = auth.uid()
));

CREATE POLICY "Users can update invoice items for their own mcards" 
ON public.mcard_invoice_items 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.mcard_invoices mi
  JOIN public.mcards m ON m.id = mi.mcard_id
  WHERE mi.id = mcard_invoice_items.invoice_id 
  AND m.user_id = auth.uid()
));

CREATE POLICY "Users can delete invoice items for their own mcards" 
ON public.mcard_invoice_items 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.mcard_invoices mi
  JOIN public.mcards m ON m.id = mi.mcard_id
  WHERE mi.id = mcard_invoice_items.invoice_id 
  AND m.user_id = auth.uid()
));

-- Trigger pour mise à jour automatique du timestamp
CREATE TRIGGER update_mcard_invoices_updated_at
  BEFORE UPDATE ON public.mcard_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour générer un numéro de facture unique
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  -- Générer un numéro basé sur la date et un compteur
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO counter
  FROM public.mcard_invoices
  WHERE invoice_number LIKE 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || TO_CHAR(CURRENT_DATE, 'MM') || '-%';
  
  new_number := 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-' || LPAD(counter::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;