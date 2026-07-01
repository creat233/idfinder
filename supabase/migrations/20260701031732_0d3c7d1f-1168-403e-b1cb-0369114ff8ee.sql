
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

ALTER TABLE public.auto_reply_settings
  ADD COLUMN IF NOT EXISTS ai_agent_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_context text;

CREATE OR REPLACE FUNCTION public.send_auto_reply()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  recipient_settings RECORD;
  auto_message TEXT;
  recent_auto_reply UUID;
  edge_url TEXT := 'https://jrnznosfclfepqdxyhjh.supabase.co/functions/v1/ai-auto-reply';
BEGIN
  SELECT * INTO recipient_settings
  FROM public.auto_reply_settings
  WHERE user_id = NEW.recipient_id AND enabled = true;

  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  SELECT id INTO recent_auto_reply
  FROM public.mcard_messages
  WHERE sender_id = NEW.recipient_id
    AND recipient_id = NEW.sender_id
    AND subject IN ('[Auto-réponse]', '[Agent IA]')
    AND created_at > (now() - CASE WHEN recipient_settings.ai_agent_enabled THEN interval '2 hours' ELSE interval '24 hours' END)
  LIMIT 1;

  IF FOUND THEN
    RETURN NEW;
  END IF;

  IF recipient_settings.ai_agent_enabled = true THEN
    BEGIN
      PERFORM net.http_post(
        url := edge_url,
        headers := jsonb_build_object('Content-Type','application/json'),
        body := jsonb_build_object('message_id', NEW.id)
      );
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
    RETURN NEW;
  END IF;

  IF recipient_settings.selected_message = 'custom' THEN
    auto_message := recipient_settings.custom_message;
  ELSIF recipient_settings.selected_message = 'vacation' THEN
    auto_message := 'Bonjour ! Je suis actuellement en vacances et ne suis pas disponible. Je vous répondrai dès mon retour. Merci de votre patience !';
  ELSIF recipient_settings.selected_message = 'busy' THEN
    auto_message := 'Bonjour ! Je suis actuellement occupé et ne peux pas répondre immédiatement. Je vous contacterai dès que possible.';
  ELSIF recipient_settings.selected_message = 'away' THEN
    auto_message := 'Bonjour ! Je suis temporairement absent. Je reviendrai vers vous très prochainement. Merci pour votre message !';
  ELSIF recipient_settings.selected_message = 'weekend' THEN
    auto_message := 'Bonjour ! C''est le week-end et je ne consulte pas mes messages. Je vous répondrai dès lundi. Bon week-end !';
  ELSE
    auto_message := 'Bonjour ! Je ne suis pas disponible pour le moment. Je vous répondrai dès que possible.';
  END IF;

  IF auto_message IS NULL OR auto_message = '' THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.mcard_messages (
    sender_id, recipient_id, mcard_id, subject, message
  ) VALUES (
    NEW.recipient_id, NEW.sender_id, NEW.mcard_id, '[Auto-réponse]', auto_message
  );

  RETURN NEW;
END;
$function$;
