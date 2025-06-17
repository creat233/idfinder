
-- Corriger la fonction admin_get_all_promo_codes pour qu'elle retourne le bon type avec user_phone
DROP FUNCTION IF EXISTS public.admin_get_all_promo_codes();

CREATE OR REPLACE FUNCTION public.admin_get_all_promo_codes()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  code text,
  is_active boolean,
  is_paid boolean,
  created_at timestamptz,
  expires_at timestamptz,
  total_earnings numeric,
  usage_count integer,
  user_email text,
  user_name text,
  user_phone text
)
LANGUAGE plpgsql
SECURITY DEFINER
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
