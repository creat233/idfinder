
-- Créer la fonction RPC admin_get_all_promo_codes pour récupérer tous les codes promo avec les informations utilisateur
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
  user_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier les permissions admin
  IF NOT public.can_activate_promo_codes((SELECT email FROM auth.users WHERE auth.users.id = auth.uid())) THEN
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
    COALESCE(p.first_name || '@finderid.com', 'user@finderid.com') as user_email,
    COALESCE(p.first_name || ' ' || p.last_name, 'Utilisateur') as user_name
  FROM public.promo_codes pc
  LEFT JOIN public.profiles p ON p.id = pc.user_id
  ORDER BY pc.created_at DESC;
END;
$$;
