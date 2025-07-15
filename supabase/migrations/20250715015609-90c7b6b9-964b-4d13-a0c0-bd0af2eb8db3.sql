-- Créer une fonction pour désactiver automatiquement les codes expirés
CREATE OR REPLACE FUNCTION public.deactivate_expired_promo_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Désactiver les codes expirés qui sont encore actifs
  UPDATE public.promo_codes 
  SET is_active = false
  WHERE expires_at < NOW() 
  AND is_active = true;
END;
$$;

-- Créer une fonction pour notifier les utilisateurs de codes expirés
CREATE OR REPLACE FUNCTION public.notify_expired_promo_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_code RECORD;
BEGIN
  -- Récupérer tous les codes expirés qui sont encore marqués comme actifs
  FOR expired_code IN 
    SELECT pc.id, pc.code, pc.user_id, p.is_on_vacation
    FROM public.promo_codes pc
    LEFT JOIN public.profiles p ON p.id = pc.user_id
    WHERE pc.expires_at < NOW() 
    AND pc.is_active = true
  LOOP
    -- Désactiver le code
    UPDATE public.promo_codes 
    SET is_active = false 
    WHERE id = expired_code.id;
    
    -- Créer une notification seulement si l'utilisateur n'est pas en vacances
    IF expired_code.is_on_vacation IS NULL OR expired_code.is_on_vacation = false THEN
      INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        is_read
      ) VALUES (
        expired_code.user_id,
        'promo_expired',
        '⏰ Code promo expiré',
        'Votre code promo "' || expired_code.code || '" a expiré et a été automatiquement désactivé. Vous pouvez créer un nouveau code promo depuis votre tableau de bord.',
        false
      );
    END IF;
  END LOOP;
END;
$$;

-- Créer un trigger pour vérifier automatiquement l'expiration lors de la validation
CREATE OR REPLACE FUNCTION public.check_promo_code_expiry()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Si on essaie d'activer un code qui est expiré, l'empêcher
  IF NEW.is_active = true AND NEW.expires_at < NOW() THEN
    RAISE EXCEPTION 'Cannot activate expired promo code. Code expired on %', NEW.expires_at;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Appliquer le trigger sur les mises à jour de codes promo
DROP TRIGGER IF EXISTS check_promo_expiry_trigger ON public.promo_codes;
CREATE TRIGGER check_promo_expiry_trigger
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_promo_code_expiry();

-- Exécuter la fonction pour traiter les codes déjà expirés
SELECT public.notify_expired_promo_codes();