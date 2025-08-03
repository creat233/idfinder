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