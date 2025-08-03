-- Créer une fonction pour obtenir les cartes expirées depuis plus de 30 jours
CREATE OR REPLACE FUNCTION public.admin_get_expired_mcards()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  full_name text,
  plan text,
  user_email text,
  user_phone text,
  subscription_expires_at timestamp with time zone,
  days_expired integer,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$

-- Créer une fonction pour envoyer des notifications de renouvellement
CREATE OR REPLACE FUNCTION public.admin_send_renewal_notifications()
RETURNS TABLE(success boolean, message text, notifications_sent integer)
LANGUAGE plpgsql
SECURITY DEFINER
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