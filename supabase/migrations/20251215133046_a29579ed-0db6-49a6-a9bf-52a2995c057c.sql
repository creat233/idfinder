-- Créer la table pour les paramètres d'auto-réponse
CREATE TABLE public.auto_reply_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  selected_message TEXT NOT NULL DEFAULT 'vacation',
  custom_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.auto_reply_settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Users can view their own auto reply settings"
  ON public.auto_reply_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own auto reply settings"
  ON public.auto_reply_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own auto reply settings"
  ON public.auto_reply_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own auto reply settings"
  ON public.auto_reply_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Politique pour permettre au système de lire les paramètres lors de l'envoi d'un message
CREATE POLICY "System can read auto reply settings for message recipients"
  ON public.auto_reply_settings
  FOR SELECT
  USING (true);

-- Trigger pour updated_at
CREATE TRIGGER update_auto_reply_settings_updated_at
  BEFORE UPDATE ON public.auto_reply_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour envoyer automatiquement une réponse d'absence
CREATE OR REPLACE FUNCTION public.send_auto_reply()
RETURNS TRIGGER AS $$
DECLARE
  recipient_settings RECORD;
  auto_message TEXT;
  recent_auto_reply UUID;
BEGIN
  -- Récupérer les paramètres d'auto-réponse du destinataire
  SELECT * INTO recipient_settings
  FROM public.auto_reply_settings
  WHERE user_id = NEW.recipient_id AND enabled = true;
  
  -- Si les auto-réponses ne sont pas activées, ne rien faire
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;
  
  -- Vérifier si une auto-réponse a déjà été envoyée dans les dernières 24h
  SELECT id INTO recent_auto_reply
  FROM public.mcard_messages
  WHERE sender_id = NEW.recipient_id
    AND recipient_id = NEW.sender_id
    AND subject = '[Auto-réponse]'
    AND created_at > (now() - interval '24 hours')
  LIMIT 1;
  
  -- Si une auto-réponse récente existe, ne pas en envoyer une nouvelle
  IF FOUND THEN
    RETURN NEW;
  END IF;
  
  -- Déterminer le message à envoyer
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
  
  -- S'assurer qu'il y a un message à envoyer
  IF auto_message IS NULL OR auto_message = '' THEN
    RETURN NEW;
  END IF;
  
  -- Envoyer l'auto-réponse
  INSERT INTO public.mcard_messages (
    sender_id,
    recipient_id,
    mcard_id,
    subject,
    message
  ) VALUES (
    NEW.recipient_id,
    NEW.sender_id,
    NEW.mcard_id,
    '[Auto-réponse]',
    auto_message
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger pour envoyer automatiquement la réponse d'absence
CREATE TRIGGER trigger_send_auto_reply
  AFTER INSERT ON public.mcard_messages
  FOR EACH ROW
  WHEN (NEW.subject IS NULL OR NEW.subject != '[Auto-réponse]')
  EXECUTE FUNCTION public.send_auto_reply();