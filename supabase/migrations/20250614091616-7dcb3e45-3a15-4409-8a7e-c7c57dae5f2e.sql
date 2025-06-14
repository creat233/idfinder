
-- Ajouter une colonne promo_code_id sur la table reported_cards
ALTER TABLE public.reported_cards
ADD COLUMN promo_code_id uuid REFERENCES promo_codes(id);

-- (optionnel) Indexer la colonne pour les performances
CREATE INDEX IF NOT EXISTS idx_reported_cards_promo_code_id
  ON public.reported_cards (promo_code_id);

-- (optionnel) Si tu veux la rendre visible dans Supabase Admin, pas besoin d’action supplémentaire
