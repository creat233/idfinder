
-- ### FONCTIONNALITÉ : MODE VACANCES ###

-- 1. Ajoute une colonne à la table des profils pour gérer le statut du mode vacances
ALTER TABLE public.profiles
ADD COLUMN is_on_vacation BOOLEAN NOT NULL DEFAULT false;

-- 2. Met à jour la fonction 'notify_card_owner' pour vérifier le mode vacances
CREATE OR REPLACE FUNCTION public.notify_card_owner()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  card_owner_id UUID;
  card_owner_name TEXT;
  is_vacation_mode BOOLEAN;
BEGIN
  -- Trouve le propriétaire de la carte et son statut de vacances
  SELECT uc.user_id, p.first_name || ' ' || p.last_name, p.is_on_vacation
  INTO card_owner_id, card_owner_name, is_vacation_mode
  FROM public.user_cards uc
  JOIN public.profiles p ON p.id = uc.user_id
  WHERE uc.card_number = NEW.card_number
  AND uc.is_active = true
  LIMIT 1;

  -- Si un propriétaire est trouvé ET qu'il N'EST PAS en vacances, crée une notification
  IF card_owner_id IS NOT NULL AND (is_vacation_mode IS NULL OR is_vacation_mode = false) THEN
    INSERT INTO public.notifications (
      user_id,
      reported_card_id,
      type,
      title,
      message
    ) VALUES (
      card_owner_id,
      NEW.id,
      'card_found',
      'Votre carte a été signalée !',
      'Votre carte ' || NEW.document_type || ' avec le numéro ' || NEW.card_number || ' a été signalée comme trouvée sur FinderID. Vérifiez dans la barre de recherche pour confirmer la récupération.'
    );
  END IF;

  RETURN NEW;
END;
$function$
;

-- 3. Met à jour la fonction 'notify_owner_on_recovery_update' pour vérifier le mode vacances
CREATE OR REPLACE FUNCTION public.notify_owner_on_recovery_update()
 RETURNS trigger
 LANGUAGE plpgsql
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
$function$
;

-- 4. Met à jour la fonction 'notify_promo_owner_on_payment' pour vérifier le mode vacances
CREATE OR REPLACE FUNCTION public.notify_promo_owner_on_payment()
 RETURNS trigger
 LANGUAGE plpgsql
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
$function$
;

-- 5. Met à jour la fonction 'notify_on_new_card_added' pour vérifier le mode vacances
CREATE OR REPLACE FUNCTION public.notify_on_new_card_added()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  is_vacation_mode BOOLEAN;
BEGIN
  -- Vérifie le statut de vacances de l'utilisateur
  SELECT p.is_on_vacation INTO is_vacation_mode
  FROM public.profiles p
  WHERE p.id = NEW.user_id;

  -- Envoie une notification seulement si l'utilisateur n'est pas en vacances
  IF is_vacation_mode IS NULL OR is_vacation_mode = false THEN
    INSERT INTO public.notifications (user_id, type, title, message, is_read, card_id)
    VALUES (
      NEW.user_id,
      'card_added',
      '✅ Carte ajoutée !',
      'Votre carte (' || NEW.document_type || ') avec le numéro ' || NEW.card_number || ' a bien été ajoutée à votre liste de surveillance.',
      false,
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$function$
;

-- ### FONCTIONNALITÉ : NOTIFICATIONS DE SÉCURITÉ ###

-- 6. Ajoute une colonne à la table des profils pour activer/désactiver les notifications de sécurité
ALTER TABLE public.profiles
ADD COLUMN enable_security_notifications BOOLEAN NOT NULL DEFAULT true;

-- 7. Crée une fonction RPC pour enregistrer un événement de connexion et envoyer une notification
CREATE OR REPLACE FUNCTION public.log_login_event()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    should_notify BOOLEAN;
BEGIN
    -- Vérifie si l'utilisateur souhaite recevoir des notifications de sécurité
    SELECT p.enable_security_notifications
    INTO should_notify
    FROM public.profiles p
    WHERE p.id = auth.uid();

    -- Si le profil n'existe pas ou que la colonne est nulle, la valeur par défaut est true
    IF should_notify IS NULL THEN
        should_notify := true;
    END IF;

    -- Si activé, crée une notification
    IF should_notify = true THEN
        INSERT INTO public.notifications (user_id, type, title, message)
        VALUES (
            auth.uid(),
            'security_alert',
            'Alerte de sécurité : Nouvelle connexion',
            'Une nouvelle connexion à votre compte a été détectée. Si ce n''était pas vous, veuillez changer votre mot de passe immédiatement.'
        );
    END IF;
END;
$$;
