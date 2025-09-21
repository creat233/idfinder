-- SECURITY FIX: Add proper search paths to all remaining security definer functions
-- This fixes the "Function Search Path Mutable" warnings

-- Fix all existing security definer functions by adding SET search_path = public

CREATE OR REPLACE FUNCTION public.admin_activate_promo_code(promo_code_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_email TEXT;
  code_exists BOOLEAN;
BEGIN
  -- Récupérer l'email de l'utilisateur actuel
  SELECT email INTO current_user_email
  FROM auth.users 
  WHERE id = auth.uid();
  
  -- Vérifier si l'utilisateur a la permission d'activer les codes
  IF NOT public.can_activate_promo_codes(current_user_email) THEN
    RAISE EXCEPTION 'Permission denied: Only authorized admins can activate promo codes';
  END IF;
  
  -- Vérifier si le code existe
  SELECT EXISTS (
    SELECT 1 FROM public.promo_codes 
    WHERE code = promo_code_text
  ) INTO code_exists;
  
  IF NOT code_exists THEN
    RAISE EXCEPTION 'Promo code not found';
  END IF;
  
  -- Activer le code
  UPDATE public.promo_codes 
  SET 
    is_active = true,
    is_paid = true
  WHERE code = promo_code_text;
  
  RETURN true;
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

CREATE OR REPLACE FUNCTION public.admin_approve_mcard_subscription(p_mcard_id uuid)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mcard public.mcards;
  v_plan_name text;
  v_notification_title text;
  v_notification_message text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  -- Get the mCard details
  SELECT * INTO v_mcard FROM public.mcards WHERE id = p_mcard_id;

  IF v_mcard IS NULL THEN
    RETURN QUERY SELECT false, 'mCard not found.';
    RETURN;
  END IF;

  -- Update the mCard subscription with monthly expiration
  UPDATE public.mcards
  SET
    subscription_status = 'active',
    subscription_expires_at = now() + interval '1 month',
    is_published = true,
    updated_at = now()
  WHERE id = p_mcard_id;

  -- Prepare notification based on plan
  v_plan_name := CASE v_mcard.plan
    WHEN 'essential' THEN 'Essentiel (2000 FCFA/mois)'
    WHEN 'premium' THEN 'Premium (5000 FCFA/mois)'
    ELSE v_mcard.plan
  END;

  v_notification_title := '🎉 Votre carte mCard est maintenant active !';
  v_notification_message := 'Félicitations ! Votre carte "' || v_mcard.full_name || '" avec le plan ' || v_plan_name || ' a été activée avec succès. Votre carte est maintenant visible publiquement et vous pouvez commencer à la partager. Votre abonnement est valide pour un mois.';

  -- Insert notification for the user
  INSERT INTO public.notifications (user_id, type, title, message, is_read)
  VALUES (v_mcard.user_id, 'mcard_activation_success', v_notification_title, v_notification_message, false);

  -- Log the activation in audit logs
  INSERT INTO public.audit_logs (action, user_email, details)
  VALUES (
    'mcard_activated',
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    jsonb_build_object(
      'mcard_id', p_mcard_id,
      'mcard_name', v_mcard.full_name,
      'plan', v_mcard.plan,
      'user_id', v_mcard.user_id
    )
  );

  RETURN QUERY SELECT true, 'Carte activée avec succès et notification envoyée.';
END;
$$;