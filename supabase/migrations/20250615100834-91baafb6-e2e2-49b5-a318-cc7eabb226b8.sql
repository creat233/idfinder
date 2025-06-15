
-- Ajoute des colonnes à la table reported_cards pour stocker les informations
-- sur les prix au moment où une demande de récupération est faite.
ALTER TABLE public.reported_cards ADD COLUMN recovery_base_fee NUMERIC;
ALTER TABLE public.reported_cards ADD COLUMN recovery_final_price NUMERIC;
ALTER TABLE public.reported_cards ADD COLUMN recovery_currency TEXT;
ALTER TABLE public.reported_cards ADD COLUMN recovery_currency_symbol TEXT;
