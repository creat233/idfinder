
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_email = (select auth.jwt() ->> 'email')
    AND is_active = true
  );
$function$;

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
  -- Vérifier si l'utilisateur est un administrateur
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  -- Retourner les informations des utilisateurs
  RETURN QUERY
  SELECT
    u.id,
    u.email::text,
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
