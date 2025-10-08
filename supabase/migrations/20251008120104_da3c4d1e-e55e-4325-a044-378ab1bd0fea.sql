-- Permettre aux visiteurs de voir les factures publiées et validées
-- Ajouter une politique RLS pour permettre la consultation publique des factures validées

-- Créer une politique pour permettre la visualisation publique des factures validées
CREATE POLICY "Public can view validated invoices for published mcards"
ON public.mcard_invoices
FOR SELECT
TO public
USING (
  is_validated = true
  AND status IN ('sent', 'paid')
  AND EXISTS (
    SELECT 1 FROM public.mcards 
    WHERE mcards.id = mcard_invoices.mcard_id 
    AND mcards.is_published = true
    AND mcards.subscription_status = 'active'
  )
);

-- Créer une politique pour permettre la visualisation publique des items de factures validées
CREATE POLICY "Public can view items of validated invoices"
ON public.mcard_invoice_items
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.mcard_invoices mi
    WHERE mi.id = mcard_invoice_items.invoice_id
    AND mi.is_validated = true
    AND mi.status IN ('sent', 'paid')
    AND EXISTS (
      SELECT 1 FROM public.mcards m
      WHERE m.id = mi.mcard_id
      AND m.is_published = true
      AND m.subscription_status = 'active'
    )
  )
);