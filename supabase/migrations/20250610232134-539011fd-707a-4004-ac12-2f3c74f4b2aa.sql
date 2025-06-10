
-- Créer une table pour stocker les cartes des utilisateurs
CREATE TABLE public.user_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  card_number TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'id',
  card_holder_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_user_cards_card_number ON public.user_cards(card_number);
CREATE INDEX idx_user_cards_user_id ON public.user_cards(user_id);

-- Activer RLS
ALTER TABLE public.user_cards ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs voient seulement leurs cartes
CREATE POLICY "Users can view their own cards" 
  ON public.user_cards 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cards" 
  ON public.user_cards 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards" 
  ON public.user_cards 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards" 
  ON public.user_cards 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Créer une table pour les notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  card_id UUID REFERENCES public.user_cards,
  reported_card_id UUID REFERENCES public.reported_cards,
  type TEXT NOT NULL DEFAULT 'card_found',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour les notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- RLS pour les notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Fonction pour créer une notification quand une carte est signalée
CREATE OR REPLACE FUNCTION public.notify_card_owner()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  card_owner_id UUID;
  card_owner_name TEXT;
BEGIN
  -- Rechercher si ce numéro de carte appartient à un utilisateur
  SELECT uc.user_id, p.first_name || ' ' || p.last_name
  INTO card_owner_id, card_owner_name
  FROM public.user_cards uc
  JOIN public.profiles p ON p.id = uc.user_id
  WHERE uc.card_number = NEW.card_number 
  AND uc.is_active = true
  LIMIT 1;

  -- Si un propriétaire est trouvé, créer une notification
  IF card_owner_id IS NOT NULL THEN
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
$function$;

-- Créer le trigger pour notifier automatiquement
CREATE TRIGGER trigger_notify_card_owner
  AFTER INSERT ON public.reported_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_card_owner();
