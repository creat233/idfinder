-- Ajouter la vérification aux MCards
ALTER TABLE public.mcards 
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_status TEXT DEFAULT 'not_requested';

-- Table des demandes de vérification
CREATE TABLE public.mcard_verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  id_document_url TEXT NOT NULL,
  ninea_document_url TEXT,
  payment_status TEXT DEFAULT 'pending',
  verification_fee NUMERIC DEFAULT 5000,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  processed_by UUID,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des interactions (likes, favoris)
CREATE TABLE public.mcard_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'favorite')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mcard_id, interaction_type)
);

-- Table des messages
CREATE TABLE public.mcard_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE public.mcard_verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcard_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcard_messages ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour mcard_verification_requests
CREATE POLICY "Users can create verification requests for their mcards" 
ON public.mcard_verification_requests 
FOR INSERT 
WITH CHECK (
  user_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM public.mcards WHERE id = mcard_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view their verification requests" 
ON public.mcard_verification_requests 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all verification requests" 
ON public.mcard_verification_requests 
FOR ALL 
USING (is_admin());

-- Politiques RLS pour mcard_interactions
CREATE POLICY "Users can manage their own interactions" 
ON public.mcard_interactions 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Anyone can view interactions for published mcards" 
ON public.mcard_interactions 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM public.mcards WHERE id = mcard_id AND is_published = true)
);

-- Politiques RLS pour mcard_messages
CREATE POLICY "Users can send messages" 
ON public.mcard_messages 
FOR INSERT 
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can view their messages" 
ON public.mcard_messages 
FOR SELECT 
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can update their received messages" 
ON public.mcard_messages 
FOR UPDATE 
USING (recipient_id = auth.uid());

-- Bucket pour les documents de vérification
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verification-documents', 'verification-documents', false);

-- Politiques pour le bucket de vérification
CREATE POLICY "Users can upload their verification documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'verification-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their verification documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'verification-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all verification documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'verification-documents' AND is_admin());

-- Fonction pour approuver une vérification
CREATE OR REPLACE FUNCTION public.admin_approve_mcard_verification(p_request_id UUID)
RETURNS TABLE(success BOOLEAN, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request public.mcard_verification_requests;
  v_mcard public.mcards;
BEGIN
  -- Vérifier les permissions admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  -- Récupérer la demande
  SELECT * INTO v_request FROM public.mcard_verification_requests WHERE id = p_request_id;
  
  IF v_request IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Demande non trouvée.';
    RETURN;
  END IF;

  -- Récupérer la MCard
  SELECT * INTO v_mcard FROM public.mcards WHERE id = v_request.mcard_id;

  -- Approuver la vérification
  UPDATE public.mcard_verification_requests
  SET 
    status = 'approved',
    processed_by = auth.uid(),
    processed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_request_id;

  -- Marquer la MCard comme vérifiée
  UPDATE public.mcards
  SET 
    is_verified = TRUE,
    verification_status = 'verified',
    updated_at = NOW()
  WHERE id = v_request.mcard_id;

  -- Créer une notification pour l'utilisateur
  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (
    v_request.user_id,
    'verification_approved',
    '✅ Vérification approuvée !',
    'Félicitations ! Votre MCard "' || v_mcard.full_name || '" a été vérifiée avec succès. Le badge "Vérifié" est maintenant visible sur votre carte.'
  );

  RETURN QUERY SELECT TRUE, 'Vérification approuvée avec succès.';
END;
$$;

-- Triggers pour les timestamps
CREATE TRIGGER update_mcard_verification_requests_updated_at
  BEFORE UPDATE ON public.mcard_verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mcard_messages_updated_at
  BEFORE UPDATE ON public.mcard_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();