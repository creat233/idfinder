-- Mise à jour de la fonction d'activation des mCards pour envoyer des notifications
CREATE OR REPLACE FUNCTION public.admin_approve_mcard_subscription(p_mcard_id uuid)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;