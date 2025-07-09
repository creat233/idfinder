
-- Créer une table pour gérer les utilisateurs bloqués
CREATE TABLE public.mcard_blocked_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mcard_id UUID NOT NULL,
  blocked_user_id UUID NOT NULL,
  blocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (mcard_id) REFERENCES public.mcards(id) ON DELETE CASCADE,
  UNIQUE(mcard_id, blocked_user_id)
);

-- Enable RLS
ALTER TABLE public.mcard_blocked_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage blocked users for their own mcards" 
ON public.mcard_blocked_users 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.mcards 
  WHERE mcards.id = mcard_blocked_users.mcard_id 
  AND mcards.user_id = auth.uid()
));

-- Fonction pour vérifier si un utilisateur est bloqué
CREATE OR REPLACE FUNCTION public.is_user_blocked(p_mcard_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.mcard_blocked_users
    WHERE mcard_id = p_mcard_id 
    AND blocked_user_id = p_user_id
  );
$$;

-- Mettre à jour la politique des messages pour empêcher les utilisateurs bloqués d'envoyer des messages
DROP POLICY IF EXISTS "Users can send messages" ON public.mcard_messages;

CREATE POLICY "Users can send messages" 
ON public.mcard_messages 
FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() 
  AND NOT public.is_user_blocked(mcard_id, auth.uid())
);

-- Fonction pour mettre à jour les analytics en temps réel
CREATE OR REPLACE FUNCTION public.update_mcard_analytics_on_interaction()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Incrémenter le compteur approprié
    IF NEW.interaction_type = 'like' THEN
      UPDATE public.mcard_analytics
      SET likes_count = likes_count + 1
      WHERE mcard_id = NEW.mcard_id;
    ELSIF NEW.interaction_type = 'favorite' THEN
      UPDATE public.mcard_analytics
      SET favorites_count = favorites_count + 1
      WHERE mcard_id = NEW.mcard_id;
    ELSIF NEW.interaction_type = 'share' THEN
      UPDATE public.mcard_analytics
      SET shares_count = shares_count + 1
      WHERE mcard_id = NEW.mcard_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    -- Décrémenter le compteur approprié
    IF OLD.interaction_type = 'like' THEN
      UPDATE public.mcard_analytics
      SET likes_count = GREATEST(0, likes_count - 1)
      WHERE mcard_id = OLD.mcard_id;
    ELSIF OLD.interaction_type = 'favorite' THEN
      UPDATE public.mcard_analytics
      SET favorites_count = GREATEST(0, favorites_count - 1)
      WHERE mcard_id = OLD.mcard_id;
    ELSIF OLD.interaction_type = 'share' THEN
      UPDATE public.mcard_analytics
      SET shares_count = GREATEST(0, shares_count - 1)
      WHERE mcard_id = OLD.mcard_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour mettre à jour les analytics automatiquement
DROP TRIGGER IF EXISTS update_analytics_on_interaction ON public.mcard_interactions;
CREATE TRIGGER update_analytics_on_interaction
AFTER INSERT OR DELETE ON public.mcard_interactions
FOR EACH ROW
EXECUTE FUNCTION public.update_mcard_analytics_on_interaction();

-- Ajouter une contrainte unique pour éviter les doublons d'interactions
ALTER TABLE public.mcard_interactions 
ADD CONSTRAINT unique_user_mcard_interaction 
UNIQUE (user_id, mcard_id, interaction_type);
