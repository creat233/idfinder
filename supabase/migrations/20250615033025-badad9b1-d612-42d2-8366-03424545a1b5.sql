
-- 1. On supprime l'ancien trigger qui met à jour les gains et utilisations à l'insertion
DROP TRIGGER IF EXISTS trigger_update_promo_earnings ON public.promo_usage;

-- 2. On supprime l'ancienne fonction, car nous la remplaçons par deux fonctions plus spécifiques
DROP FUNCTION IF EXISTS public.update_promo_earnings();

-- 3. Nouvelle fonction pour incrémenter le COMPTEUR D'UTILISATION lors d'une nouvelle utilisation
CREATE OR REPLACE FUNCTION public.increment_promo_usage_count()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Met à jour le compteur d'utilisation pour le code promo concerné
  UPDATE public.promo_codes 
  SET usage_count = usage_count + 1
  WHERE id = NEW.promo_code_id;
  RETURN NEW;
END;
$function$;

-- 4. Trigger pour le compteur d'utilisation, qui se déclenche sur INSERT
CREATE TRIGGER trigger_increment_promo_usage_count
  AFTER INSERT ON public.promo_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_promo_usage_count();

-- 5. Nouvelle fonction pour mettre à jour les GAINS uniquement LORS DE LA CONFIRMATION DU PAIEMENT
CREATE OR REPLACE FUNCTION public.update_promo_earnings_on_payment()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Vérifie si le statut de paiement passe de non-payé à payé
  IF NEW.is_paid = true AND OLD.is_paid = false THEN
    -- Met à jour les gains totaux pour le code promo
    UPDATE public.promo_codes 
    SET total_earnings = total_earnings + NEW.discount_amount
    WHERE id = NEW.promo_code_id;
  END IF;
  RETURN NEW;
END;
$function$;

-- 6. Trigger pour les gains, qui se déclenche sur UPDATE (lors de la confirmation)
CREATE TRIGGER trigger_update_promo_earnings_on_payment
  AFTER UPDATE ON public.promo_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_promo_earnings_on_payment();
