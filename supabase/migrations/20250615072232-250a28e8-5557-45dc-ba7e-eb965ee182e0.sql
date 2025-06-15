
-- Corrige la fonction pour récupérer les utilisateurs en s'assurant que le type de l'email est correct.
CREATE OR REPLACE FUNCTION public.admin_get_all_users()
RETURNS TABLE(
  id uuid,
  email text,
  created_at timestamp with time zone,
  first_name text,
  last_name text,
  phone text,
  country text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::text, -- Conversion explicite pour éviter les erreurs de type
    u.created_at,
    p.first_name,
    p.last_name,
    p.phone,
    p.country
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  ORDER BY u.created_at DESC;
END;
$function$;

-- Corrige la fonction pour les codes promo, qui avait le même problème de type d'email.
CREATE OR REPLACE FUNCTION public.admin_get_all_promo_codes()
 RETURNS TABLE(id uuid, user_id uuid, code text, is_active boolean, is_paid boolean, created_at timestamp with time zone, expires_at timestamp with time zone, total_earnings numeric, usage_count integer, user_email text, user_name text, user_phone text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF NOT public.is_admin() THEN
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
    COALESCE(u.email::text, 'Non disponible') as user_email, -- Conversion explicite
    COALESCE(p.first_name || ' ' || COALESCE(p.last_name, ''), 'Utilisateur') as user_name,
    COALESCE(p.phone, 'Non renseigné') as user_phone
  FROM public.promo_codes pc
  LEFT JOIN public.profiles p ON p.id = pc.user_id
  LEFT JOIN auth.users u ON u.id = pc.user_id
  ORDER BY pc.created_at DESC;
END;
$function$;
