-- Supprimer l'ancienne contrainte valid_plan_check
ALTER TABLE public.mcards DROP CONSTRAINT IF EXISTS valid_plan_check;

-- Ajouter la nouvelle contrainte avec ultimate inclus
ALTER TABLE public.mcards ADD CONSTRAINT valid_plan_check 
CHECK (plan IN ('free', 'essential', 'premium', 'ultimate'));