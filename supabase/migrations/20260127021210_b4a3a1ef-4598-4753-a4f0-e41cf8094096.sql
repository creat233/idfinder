-- Fix the ambiguous column reference in get_mcard_favorite_emails function
CREATE OR REPLACE FUNCTION public.get_mcard_favorite_emails(p_mcard_id uuid)
 RETURNS TABLE(user_id uuid, email text, first_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Vérifier que l'utilisateur est propriétaire de la MCard
  IF NOT EXISTS (
    SELECT 1 FROM public.mcards 
    WHERE id = p_mcard_id AND mcards.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Permission denied: You do not own this MCard';
  END IF;

  RETURN QUERY
  SELECT 
    mf.user_id AS user_id,
    u.email::TEXT AS email,
    COALESCE(p.first_name, 'Client')::TEXT AS first_name
  FROM public.mcard_favorites mf
  JOIN auth.users u ON u.id = mf.user_id
  LEFT JOIN public.profiles p ON p.id = mf.user_id
  WHERE mf.mcard_id = p_mcard_id;
END;
$function$;