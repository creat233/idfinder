-- Créer une table pour les messages d'administration
CREATE TABLE public.admin_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    card_id UUID NOT NULL REFERENCES public.reported_cards(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL DEFAULT 'recovery_request',
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    card_info JSONB,
    owner_info JSONB,
    promo_info JSONB,
    price_info JSONB,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'processed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID,
    metadata JSONB
);

-- Activer RLS
ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour admin seulement
CREATE POLICY "Only admins can view admin messages" 
ON public.admin_messages 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Only admins can insert admin messages" 
ON public.admin_messages 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update admin messages" 
ON public.admin_messages 
FOR UPDATE 
USING (public.is_admin());

-- Créer un index pour les performances
CREATE INDEX idx_admin_messages_status ON public.admin_messages(status);
CREATE INDEX idx_admin_messages_created_at ON public.admin_messages(created_at DESC);
CREATE INDEX idx_admin_messages_priority ON public.admin_messages(priority);

-- Fonction pour créer automatiquement un message admin lors d'une demande de récupération
CREATE OR REPLACE FUNCTION public.create_admin_message_on_recovery()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;