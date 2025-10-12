-- Corriger le trigger notify_on_new_message pour gérer les valeurs NULL
CREATE OR REPLACE FUNCTION public.notify_on_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  recipient_vacation_mode BOOLEAN;
  sender_name TEXT;
  mcard_name TEXT;
  notification_message TEXT;
BEGIN
  -- Vérifier le mode vacances du destinataire
  SELECT p.is_on_vacation INTO recipient_vacation_mode
  FROM public.profiles p
  WHERE p.id = NEW.recipient_id;

  -- Récupérer le nom de l'expéditeur
  SELECT COALESCE(p.first_name || ' ' || COALESCE(p.last_name, ''), 'Un visiteur')
  INTO sender_name
  FROM public.profiles p
  WHERE p.id = NEW.sender_id;

  -- Récupérer le nom de la mCard
  SELECT m.full_name INTO mcard_name
  FROM public.mcards m
  WHERE m.id = NEW.mcard_id;

  -- Construire le message de notification
  notification_message := COALESCE(sender_name, 'Un visiteur') || 
    ' vous a envoyé un message concernant votre mCard "' || 
    COALESCE(mcard_name, 'votre carte') || '"';
  
  -- Ajouter le sujet si présent
  IF NEW.subject IS NOT NULL AND NEW.subject != '' THEN
    notification_message := notification_message || ' - Sujet: ' || NEW.subject;
  END IF;

  -- Créer une notification seulement si le destinataire n'est pas en vacances
  IF recipient_vacation_mode IS NULL OR recipient_vacation_mode = false THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      is_read,
      action_url
    ) VALUES (
      NEW.recipient_id,
      'new_message',
      '💬 Nouveau message reçu',
      notification_message,
      false,
      '/messages'
    );
  END IF;

  RETURN NEW;
END;
$function$;