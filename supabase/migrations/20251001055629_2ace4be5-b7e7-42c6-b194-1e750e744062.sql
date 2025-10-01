-- Ajouter une colonne is_validated aux factures
ALTER TABLE public.mcard_invoices 
ADD COLUMN is_validated boolean NOT NULL DEFAULT false;

-- Ajouter une colonne validated_at pour tracker quand la facture a été validée
ALTER TABLE public.mcard_invoices 
ADD COLUMN validated_at timestamp with time zone DEFAULT NULL;

-- Ajouter un index pour améliorer les performances des requêtes
CREATE INDEX idx_mcard_invoices_validated ON public.mcard_invoices(is_validated);