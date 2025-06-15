
-- Function for admins to get mCards with pending payments
CREATE OR REPLACE FUNCTION public.admin_get_pending_mcards()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  plan text,
  created_at timestamptz,
  user_email text,
  user_phone text
)
LANGUAGE plpgsql
SECURITY DEFINER
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
    p.phone AS user_phone
  FROM public.mcards m
  JOIN auth.users u ON m.user_id = u.id
  LEFT JOIN public.profiles p ON m.user_id = p.id
  WHERE m.subscription_status = 'pending_payment'
  ORDER BY m.created_at ASC;
END;
$$;

-- Function for admins to approve mCard subscription payment
CREATE OR REPLACE FUNCTION public.admin_approve_mcard_subscription(p_mcard_id uuid)
RETURNS TABLE (
    success boolean,
    message text
)
LANGUAGE plpgsql
SECURITY DEFINER
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

  -- Update the mCard subscription
  UPDATE public.mcards
  SET
    subscription_status = 'active',
    subscription_expires_at = now() + interval '1 year'
  WHERE id = p_mcard_id;

  -- Prepare and insert notification for the user
  v_plan_name := CASE v_mcard.plan
    WHEN 'essential' THEN 'Essentiel'
    WHEN 'premium' THEN 'Premium'
    ELSE v_mcard.plan
  END;

  v_notification_title := 'Abonnement mCard activé !';
  v_notification_message := 'Votre abonnement au plan ' || v_plan_name || ' pour la carte "' || v_mcard.full_name || '" a été activé. Il est valide pour un an.';

  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (v_mcard.user_id, 'mcard_subscription_activated', v_notification_title, v_notification_message);

  RETURN QUERY SELECT true, 'Subscription activated successfully.';
END;
$$;
