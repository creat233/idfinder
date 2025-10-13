-- Supprimer l'ancienne contrainte sur le plan
ALTER TABLE public.mcards DROP CONSTRAINT IF EXISTS mcards_plan_check;

-- Ajouter la nouvelle contrainte avec ultimate inclus
ALTER TABLE public.mcards ADD CONSTRAINT mcards_plan_check 
CHECK (plan IN ('free', 'essential', 'premium', 'ultimate'));