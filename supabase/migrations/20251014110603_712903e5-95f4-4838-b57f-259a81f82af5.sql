-- Ajouter la colonne mask_enabled à la table mcard_customization
ALTER TABLE public.mcard_customization 
ADD COLUMN IF NOT EXISTS mask_enabled boolean DEFAULT false;