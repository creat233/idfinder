-- Corriger tous les problèmes de sécurité des fonctions sans search_path
-- Mettre à jour toutes les fonctions restantes pour sécuriser le search_path

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  -- Générer un numéro basé sur la date et un compteur
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO counter
  FROM public.mcard_invoices
  WHERE invoice_number LIKE 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || TO_CHAR(CURRENT_DATE, 'MM') || '-%';
  
  new_number := 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-' || LPAD(counter::TEXT, 4, '0');
  
  RETURN new_number;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_favorites_on_status_added()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
  mcard_owner_name TEXT;
  favorite_user_id UUID;
BEGIN
  -- Récupérer le nom du propriétaire de la carte
  SELECT full_name INTO mcard_owner_name
  FROM mcards 
  WHERE id = NEW.mcard_id;
  
  -- Envoyer une notification à tous les utilisateurs qui ont cette carte en favori
  FOR favorite_user_id IN 
    SELECT user_id 
    FROM mcard_favorites 
    WHERE mcard_id = NEW.mcard_id
  LOOP
    INSERT INTO notifications (
      user_id,
      card_id,
      type,
      title,
      message
    ) VALUES (
      favorite_user_id,
      NEW.mcard_id,
      'status_added',
      'Nouveau statut publié',
      mcard_owner_name || ' a publié un nouveau statut : ' || LEFT(NEW.status_text, 50) || 
      CASE WHEN LENGTH(NEW.status_text) > 50 THEN '...' ELSE '' END
    );
  END LOOP;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_promo_stats_on_payment()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.create_admin_message_on_recovery()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  -- Vérifier si le statut change vers 'recovery_requested'
  IF NEW.status = 'recovery_requested' AND (OLD.status IS NULL OR OLD.status != 'recovery_requested') THEN
    INSERT INTO public.admin_messages (
      card_id,
      message_type,
      title,
      content,
      card_info,
      priority
    ) VALUES (
      NEW.id,
      'recovery_request',
      '🔍 Nouvelle demande de récupération',
      'Une nouvelle demande de récupération a été soumise pour la carte ' || NEW.card_number || '. Vérifiez les détails et traitez la demande.',
      jsonb_build_object(
        'card_number', NEW.card_number,
        'document_type', NEW.document_type,
        'found_location', NEW.found_location,
        'description', NEW.description,
        'recovery_final_price', NEW.recovery_final_price,
        'recovery_currency_symbol', NEW.recovery_currency_symbol
      ),
      'high'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_owner_on_recovery_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
  card_owner_id UUID;
  is_vacation_mode BOOLEAN;
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT uc.user_id, p.is_on_vacation
    INTO card_owner_id, is_vacation_mode
    FROM public.user_cards uc
    JOIN public.profiles p ON p.id = uc.user_id
    WHERE uc.card_number = NEW.card_number
    AND uc.is_active = true
    LIMIT 1;

    IF card_owner_id IS NOT NULL AND (is_vacation_mode IS NULL OR is_vacation_mode = false) THEN
      IF NEW.status = 'recovery_confirmed' THEN
        notification_title := '✅ Récupération confirmée';
        notification_message := 'Bonne nouvelle ! La récupération de votre carte ' || NEW.card_number || ' a été confirmée. Nous vous contacterons bientôt pour la remise.';
      ELSIF NEW.status = 'completed' THEN
        notification_title := '🎉 Carte récupérée !';
        notification_message := 'Félicitations ! Votre carte ' || NEW.card_number || ' a été marquée comme récupérée. Merci d''utiliser FinderID !';
      ELSIF NEW.status = 'cancelled' THEN
        notification_title := '❌ Récupération annulée';
        notification_message := 'La procédure de récupération pour la carte ' || NEW.card_number || ' a été annulée.';
      END IF;

      IF notification_title IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, reported_card_id, type, title, message, is_read)
        VALUES (card_owner_id, NEW.id, 'recovery_update', notification_title, notification_message, false);
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_promo_owner_on_payment()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
  promo_owner_id UUID;
  is_vacation_mode BOOLEAN;
  promo_code_text TEXT;
BEGIN
  IF NEW.is_paid = true AND (OLD.is_paid IS NULL OR OLD.is_paid = false) THEN
    SELECT pc.user_id, pc.code, p.is_on_vacation
    INTO promo_owner_id, promo_code_text, is_vacation_mode
    FROM public.promo_codes pc
    JOIN public.profiles p ON p.id = pc.user_id
    WHERE pc.id = NEW.promo_code_id;

    IF promo_owner_id IS NOT NULL AND (is_vacation_mode IS NULL OR is_vacation_mode = false) THEN
      INSERT INTO public.notifications (user_id, reported_card_id, type, title, message, is_read)
      VALUES (
        promo_owner_id,
        NEW.reported_card_id,
        'promo_payment_received',
        '💸 Paiement reçu !',
        'Vous avez reçu un paiement de 1000 FCFA pour l''utilisation de votre code promo ' || promo_code_text || '. Merci de votre contribution !',
        false
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_expired_promo_codes()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
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
$function$;