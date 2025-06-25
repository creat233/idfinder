
-- Supprimer la colonne price de la table mcards car elle n'est plus nécessaire
ALTER TABLE public.mcards DROP COLUMN IF EXISTS price;

-- Mettre à jour les cartes existantes 'free' vers 'essential' car on supprime le plan gratuit
UPDATE public.mcards SET plan = 'essential' WHERE plan = 'free';

-- Ajouter une contrainte pour s'assurer que seuls les plans payants sont acceptés
ALTER TABLE public.mcards ADD CONSTRAINT valid_plan_check CHECK (plan IN ('essential', 'premium'));

-- Créer une table pour gérer l'état de publication des mCards
ALTER TABLE public.mcards ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;

-- Mettre à jour le statut de publication : les cartes actives restent publiées, les autres non
UPDATE public.mcards SET is_published = CASE 
  WHEN subscription_status = 'active' THEN true 
  ELSE false 
END;

-- Créer un trigger pour s'assurer que les nouvelles cartes payantes ne sont pas publiées par défaut
CREATE OR REPLACE FUNCTION public.handle_new_mcard_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Pour les nouveaux plans payants, s'assurer qu'ils ne sont pas publiés par défaut
  IF NEW.plan IN ('essential', 'premium') AND NEW.subscription_status = 'pending_payment' THEN
    NEW.is_published = false;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Appliquer le trigger
DROP TRIGGER IF EXISTS trigger_handle_new_mcard_creation ON public.mcards;
CREATE TRIGGER trigger_handle_new_mcard_creation
  BEFORE INSERT ON public.mcards
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_mcard_creation();
