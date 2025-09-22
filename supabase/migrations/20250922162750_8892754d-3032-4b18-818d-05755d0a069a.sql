-- Corriger les deux dernières fonctions restantes pour la sécurité
CREATE OR REPLACE FUNCTION public.notify_on_new_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
  recipient_vacation_mode BOOLEAN;
  sender_name TEXT;
BEGIN
  -- Vérifier le mode vacances du destinataire
  SELECT p.is_on_vacation INTO recipient_vacation_mode
  FROM public.profiles p
  WHERE p.id = NEW.recipient_id;

  -- Récupérer le nom de l'expéditeur
  SELECT COALESCE(p.first_name || ' ' || COALESCE(p.last_name, ''), 'Utilisateur')
  INTO sender_name
  FROM public.profiles p
  WHERE p.id = NEW.sender_id;

  -- Créer une notification seulement si le destinataire n'est pas en vacances
  IF recipient_vacation_mode IS NULL OR recipient_vacation_mode = false THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      is_read
    ) VALUES (
      NEW.recipient_id,
      'new_message',
      '💬 Nouveau message reçu',
      'Vous avez reçu un message de ' || sender_name || 
      CASE WHEN NEW.subject IS NOT NULL THEN ' - Sujet: ' || NEW.subject ELSE '' END,
      false
    );
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_reporter_phone()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  -- Récupérer le numéro de téléphone du profil de l'utilisateur
  SELECT phone INTO NEW.reporter_phone 
  FROM profiles 
  WHERE id = NEW.reporter_id;
  
  RETURN NEW;
END;
$function$;