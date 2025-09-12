-- Fix all remaining functions missing search_path (final batch)

CREATE OR REPLACE FUNCTION public.get_audit_logs()
RETURNS TABLE(id uuid, created_at timestamp with time zone, user_email text, action text, details jsonb, ip_address text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Vérifier si l'utilisateur est un administrateur
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    al.id,
    al.created_at,
    al.user_email,
    al.action,
    al.details,
    al.ip_address
  FROM public.audit_logs al
  ORDER BY al.created_at DESC
  LIMIT 100; -- Limite pour ne pas surcharger l'interface
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_pending_renewals()
RETURNS TABLE(id uuid, mcard_id uuid, current_plan text, requested_at timestamp with time zone, status text, mcard_name text, user_email text, user_phone text, subscription_expires_at timestamp with time zone, days_remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.admin_get_all_promo_codes()
RETURNS TABLE(id uuid, user_id uuid, code text, is_active boolean, is_paid boolean, created_at timestamp with time zone, expires_at timestamp with time zone, total_earnings numeric, usage_count integer, user_email text, user_name text, user_phone text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Vérifier les permissions admin
  IF NOT public.can_activate_promo_codes((SELECT au.email FROM auth.users au WHERE au.id = auth.uid())) THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;
  
  RETURN QUERY
  SELECT 
    pc.id,
    pc.user_id,
    pc.code,
    pc.is_active,
    pc.is_paid,
    pc.created_at,
    pc.expires_at,
    pc.total_earnings,
    pc.usage_count,
    COALESCE(u.email::text, 'Non disponible') as user_email,
    COALESCE(p.first_name || ' ' || COALESCE(p.last_name, ''), 'Utilisateur') as user_name,
    COALESCE(p.phone, 'Non renseigné') as user_phone
  FROM public.promo_codes pc
  LEFT JOIN public.profiles p ON p.id = pc.user_id
  LEFT JOIN auth.users u ON u.id = pc.user_id
  ORDER BY pc.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_card_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  card_owner_id UUID;
  card_owner_name TEXT;
  is_vacation_mode BOOLEAN;
BEGIN
  -- Debug: Log de l'événement
  RAISE LOG 'Nouvelle carte signalée: numéro %, type %, signaleur %', NEW.card_number, NEW.document_type, NEW.reporter_id;
  
  -- Rechercher le propriétaire de la carte avec plus de détails de debug
  SELECT uc.user_id, p.first_name || ' ' || COALESCE(p.last_name, ''), COALESCE(p.is_on_vacation, false)
  INTO card_owner_id, card_owner_name, is_vacation_mode
  FROM public.user_cards uc
  JOIN public.profiles p ON p.id = uc.user_id
  WHERE uc.card_number = NEW.card_number 
  AND uc.is_active = true
  LIMIT 1;

  -- Debug: Log des résultats de recherche
  IF card_owner_id IS NOT NULL THEN
    RAISE LOG 'Propriétaire trouvé: ID %, nom %, vacances %', card_owner_id, card_owner_name, is_vacation_mode;
  ELSE
    RAISE LOG 'Aucun propriétaire trouvé pour la carte %', NEW.card_number;
  END IF;

  -- Si un propriétaire est trouvé ET qu'il n'est pas en vacances, créer une notification
  IF card_owner_id IS NOT NULL AND (is_vacation_mode IS NULL OR is_vacation_mode = false) THEN
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
      '🔍 Votre carte a été signalée !',
      'Excellente nouvelle ! Votre carte ' || NEW.document_type || ' avec le numéro ' || NEW.card_number || ' a été signalée comme trouvée sur FinderID. Recherchez ce numéro dans la barre de recherche pour voir les détails et confirmer la récupération.'
    );
    
    RAISE LOG 'Notification créée pour le propriétaire % de la carte %', card_owner_id, NEW.card_number;
  ELSIF card_owner_id IS NOT NULL AND is_vacation_mode = true THEN
    RAISE LOG 'Propriétaire en mode vacances, notification non envoyée pour la carte %', NEW.card_number;
  END IF;

  RETURN NEW;
END;
$$;

-- Continue with more functions...
CREATE OR REPLACE FUNCTION public.admin_get_expired_mcards()
RETURNS TABLE(id uuid, user_id uuid, full_name text, plan text, user_email text, user_phone text, subscription_expires_at timestamp with time zone, days_expired integer, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Vérifier si l'utilisateur est admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT 
    m.id,
    m.user_id,
    m.full_name,
    m.plan,
    COALESCE(u.email::text, 'Non disponible') AS user_email,
    COALESCE(p.phone, 'Non renseigné') AS user_phone,
    m.subscription_expires_at,
    EXTRACT(DAY FROM (now() - m.subscription_expires_at))::INTEGER as days_expired,
    m.created_at
  FROM public.mcards m
  LEFT JOIN auth.users u ON m.user_id = u.id
  LEFT JOIN public.profiles p ON m.user_id = p.id
  WHERE m.subscription_expires_at < (now() - interval '30 days')
  AND m.subscription_status IN ('expired', 'trial')
  ORDER BY m.subscription_expires_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_approve_mcard_renewal(p_renewal_id uuid, p_mcard_id uuid)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix all remaining functions
CREATE OR REPLACE FUNCTION public.admin_get_pending_mcards()
RETURNS TABLE(id uuid, user_id uuid, full_name text, plan text, created_at timestamp with time zone, user_email text, user_phone text, slug text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    m.id,
    m.user_id,
    m.full_name,
    m.plan,
    m.created_at,
    u.email AS user_email,
    p.phone AS user_phone,
    m.slug
  FROM public.mcards m
  JOIN auth.users u ON m.user_id = u.id
  LEFT JOIN public.profiles p ON m.user_id = p.id
  WHERE m.subscription_status = 'pending_payment'
  ORDER BY m.created_at ASC;
END;
$$;