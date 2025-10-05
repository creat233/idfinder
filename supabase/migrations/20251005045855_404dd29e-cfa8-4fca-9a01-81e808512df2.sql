-- Migration pour rendre le système de messages complètement fonctionnel
-- Correction: supprimer d'abord les triggers puis les fonctions

-- 1. Supprimer les anciens triggers et fonctions dans le bon ordre
DROP TRIGGER IF EXISTS trigger_notify_on_new_message ON public.mcard_messages;
DROP TRIGGER IF EXISTS notify_on_new_message ON public.mcard_messages;
DROP FUNCTION IF EXISTS public.notify_on_new_message() CASCADE;

-- 2. Créer la fonction de notification améliorée
CREATE OR REPLACE FUNCTION public.notify_on_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recipient_vacation_mode BOOLEAN;
  sender_name TEXT;
  mcard_name TEXT;
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
      sender_name || ' vous a envoyé un message concernant votre mCard "' || COALESCE(mcard_name, 'votre carte') || '"' ||
      CASE 
        WHEN NEW.subject IS NOT NULL THEN ' - Sujet: ' || NEW.subject 
        ELSE '' 
      END,
      false,
      '/messages'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Créer le trigger sur les nouveaux messages
CREATE TRIGGER trigger_notify_on_new_message
  AFTER INSERT ON public.mcard_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_new_message();

-- 4. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_mcard_messages_recipient_read 
ON public.mcard_messages(recipient_id, is_read);

CREATE INDEX IF NOT EXISTS idx_mcard_messages_sender 
ON public.mcard_messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_mcard_messages_mcard 
ON public.mcard_messages(mcard_id, created_at DESC);

-- 5. Ajouter des commentaires
COMMENT ON FUNCTION public.notify_on_new_message() IS 
'Envoie automatiquement une notification au destinataire quand un nouveau message est reçu';

COMMENT ON TRIGGER trigger_notify_on_new_message ON public.mcard_messages IS 
'Déclenche la création d''une notification à chaque nouveau message';