
-- Créer la table pour les demandes de renouvellement de mCard
CREATE TABLE public.mcard_renewal_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mcard_id UUID NOT NULL,
  current_plan TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.mcard_renewal_requests ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs puissent voir leurs propres demandes
CREATE POLICY "Users can view their own renewal requests" 
  ON public.mcard_renewal_requests 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.mcards 
      WHERE mcards.id = mcard_renewal_requests.mcard_id 
      AND mcards.user_id = auth.uid()
    )
  );

-- Politique pour que les utilisateurs puissent créer des demandes pour leurs propres cartes
CREATE POLICY "Users can create renewal requests for their own mcards" 
  ON public.mcard_renewal_requests 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mcards 
      WHERE mcards.id = mcard_renewal_requests.mcard_id 
      AND mcards.user_id = auth.uid()
    )
  );

-- Fonction pour récupérer les demandes de renouvellement en attente (admin seulement)
CREATE OR REPLACE FUNCTION public.admin_get_pending_renewals()
RETURNS TABLE(
  id UUID,
  mcard_id UUID,
  current_plan TEXT,
  requested_at TIMESTAMP WITH TIME ZONE,
  status TEXT,
  mcard_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  days_remaining INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier si l'utilisateur est admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT 
    mrr.id,
    mrr.mcard_id,
    mrr.current_plan,
    mrr.requested_at,
    mrr.status,
    m.full_name as mcard_name,
    u.email as user_email,
    p.phone as user_phone,
    m.subscription_expires_at,
    CASE 
      WHEN m.subscription_expires_at > now() THEN 
        EXTRACT(DAY FROM (m.subscription_expires_at - now()))::INTEGER
      ELSE 0
    END as days_remaining
  FROM public.mcard_renewal_requests mrr
  JOIN public.mcards m ON m.id = mrr.mcard_id
  JOIN auth.users u ON u.id = m.user_id
  LEFT JOIN public.profiles p ON p.id = m.user_id
  WHERE mrr.status = 'pending'
  ORDER BY mrr.requested_at ASC;
END;
$$;

-- Fonction pour approuver un renouvellement de mCard (admin seulement)
CREATE OR REPLACE FUNCTION public.admin_approve_mcard_renewal(
  p_renewal_id UUID,
  p_mcard_id UUID
)
RETURNS TABLE(success BOOLEAN, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_mcard public.mcards;
  v_days_remaining INTEGER;
  v_new_expiry TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Vérifier si l'utilisateur est admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  -- Récupérer les détails de la mCard
  SELECT * INTO v_mcard FROM public.mcards WHERE id = p_mcard_id;

  IF v_mcard IS NULL THEN
    RETURN QUERY SELECT FALSE, 'mCard not found.';
    RETURN;
  END IF;

  -- Calculer les jours restants
  IF v_mcard.subscription_expires_at > now() THEN
    v_days_remaining := EXTRACT(DAY FROM (v_mcard.subscription_expires_at - now()));
  ELSE
    v_days_remaining := 0;
  END IF;

  -- Calculer la nouvelle date d'expiration (1 an + jours restants)
  v_new_expiry := now() + INTERVAL '1 year' + (v_days_remaining || ' days')::INTERVAL;

  -- Mettre à jour la mCard
  UPDATE public.mcards
  SET
    subscription_status = 'active',
    subscription_expires_at = v_new_expiry,
    updated_at = now()
  WHERE id = p_mcard_id;

  -- Marquer la demande comme approuvée
  UPDATE public.mcard_renewal_requests
  SET
    status = 'approved',
    processed_at = now(),
    processed_by = auth.uid(),
    updated_at = now()
  WHERE id = p_renewal_id;

  -- Créer une notification pour l'utilisateur
  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (
    v_mcard.user_id,
    'mcard_renewal_approved',
    '✅ Renouvellement approuvé !',
    'Votre demande de renouvellement pour la carte "' || v_mcard.full_name || '" a été approuvée. Votre abonnement est maintenant actif pour une année supplémentaire' ||
    CASE WHEN v_days_remaining > 0 THEN ' plus ' || v_days_remaining || ' jours bonus.' ELSE '.' END
  );

  RETURN QUERY SELECT TRUE, 'Renouvellement approuvé avec succès.';
END;
$$;

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_mcard_renewal_requests_updated_at
  BEFORE UPDATE ON public.mcard_renewal_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
