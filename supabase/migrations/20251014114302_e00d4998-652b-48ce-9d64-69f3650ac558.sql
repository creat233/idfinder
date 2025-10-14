-- Permettre NULL pour subscription_expires_at sur les cartes gratuites
ALTER TABLE public.mcards 
ALTER COLUMN subscription_expires_at DROP NOT NULL;