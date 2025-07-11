-- Fonction pour créer une notification quand un message est reçu
CREATE OR REPLACE FUNCTION public.notify_on_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Créer le trigger pour notifier lors de nouveaux messages
DROP TRIGGER IF EXISTS trigger_notify_on_new_message ON public.mcard_messages;
CREATE TRIGGER trigger_notify_on_new_message
  AFTER INSERT ON public.mcard_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_new_message();