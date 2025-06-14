
-- 1. Ajouter un champ 'is_paid' et 'paid_at' à la table promo_usage pour marquer l’utilisation confirmée par un admin
ALTER TABLE public.promo_usage 
ADD COLUMN is_paid boolean NOT NULL DEFAULT false;

ALTER TABLE public.promo_usage 
ADD COLUMN paid_at timestamp with time zone;

-- 2. Créer ou mettre à jour les politiques RLS si besoin pour que seuls
--    les administrateurs puissent modifier le champ is_paid/paid_at.
-- (À personnaliser selon vos admins et vos besoins !)

-- 3. Optionnel : Ajouter un champ 'admin_confirmed_by' pour tracer qui valide

ALTER TABLE public.promo_usage 
ADD COLUMN admin_confirmed_by uuid REFERENCES auth.users;

