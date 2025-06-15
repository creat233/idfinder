
-- 1. On supprime proprement TOUS les triggers et fonctions liés aux stats des codes promo sur la table promo_usage
DROP TRIGGER IF EXISTS trigger_update_promo_earnings ON public.promo_usage;
DROP TRIGGER IF EXISTS trigger_increment_promo_usage ON public.promo_usage;
DROP TRIGGER IF EXISTS trigger_increment_promo_usage_count ON public.promo_usage;
DROP TRIGGER IF EXISTS trigger_update_promo_earnings_on_payment ON public.promo_usage;
DROP TRIGGER IF EXISTS trigger_update_promo_stats_on_payment ON public.promo_usage;

DROP FUNCTION IF EXISTS public.update_promo_earnings();
DROP FUNCTION IF EXISTS public.increment_promo_usage_count();
DROP FUNCTION IF EXISTS public.update_promo_earnings_on_payment();
DROP FUNCTION IF EXISTS public.update_promo_stats_on_payment();

-- 2. On crée UNE SEULE fonction qui met à jour le compteur d'utilisation ET les gains en même temps.
--    Elle se déclenche uniquement lorsque le paiement est confirmé par un admin.
CREATE OR REPLACE FUNCTION public.update_promo_stats_on_payment()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- On vérifie si le paiement vient d'être confirmé (is_paid passe à true)
  IF NEW.is_paid = true AND (OLD.is_paid IS NULL OR OLD.is_paid = false) THEN
    -- On met à jour le compteur d'utilisation ET les gains totaux pour le code concerné
    UPDATE public.promo_codes 
    SET 
      usage_count = usage_count + 1,
      total_earnings = total_earnings + NEW.discount_amount
    WHERE id = NEW.promo_code_id;
  END IF;
  RETURN NEW;
END;
$function$;

-- 3. On crée le trigger unique qui appellera cette fonction après chaque MISE À JOUR sur promo_usage
CREATE TRIGGER trigger_update_promo_stats_on_payment
  AFTER UPDATE ON public.promo_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_promo_stats_on_payment();
