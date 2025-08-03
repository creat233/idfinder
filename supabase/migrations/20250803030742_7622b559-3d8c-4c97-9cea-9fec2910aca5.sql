-- Créer une fonction pour envoyer des notifications de renouvellement
CREATE OR REPLACE FUNCTION public.admin_send_renewal_notifications()
RETURNS TABLE(success boolean, message text, notifications_sent integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  card_record RECORD;
  notification_count INTEGER := 0;
BEGIN
  -- Vérifier si l'utilisateur est admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  -- Parcourir toutes les cartes expirées depuis plus de 35 jours (1 mois + 5 jours)
  FOR card_record IN 
    SELECT 
      m.id,
      m.user_id,
      m.full_name,
      m.plan,
      m.subscription_expires_at,
      p.is_on_vacation
    FROM public.mcards m
    LEFT JOIN public.profiles p ON p.id = m.user_id
    WHERE m.subscription_expires_at < (now() - interval '35 days')
    AND m.subscription_status IN ('expired', 'trial')
    AND m.plan IN ('essential', 'premium')
  LOOP
    -- Créer une notification seulement si l'utilisateur n'est pas en vacances
    IF card_record.is_on_vacation IS NULL OR card_record.is_on_vacation = false THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (
        card_record.user_id,
        'subscription_renewal_reminder',
        '🔔 Rappel de renouvellement mCard',
        'Votre carte "' || card_record.full_name || '" avec le plan ' || card_record.plan || 
        ' a expiré depuis plus d''un mois. Renouvelez votre abonnement pour réactiver votre carte et continuer à bénéficier de nos services.'
      );
      notification_count := notification_count + 1;
    END IF;
  END LOOP;

  RETURN QUERY SELECT TRUE, 'Notifications envoyées avec succès', notification_count;
END;
$function$