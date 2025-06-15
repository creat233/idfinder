
CREATE OR REPLACE FUNCTION public.get_daily_user_signups()
RETURNS TABLE(signup_date date, count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier si l'utilisateur est un administrateur
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  -- Retourner le nombre d'inscriptions par jour
  RETURN QUERY
  SELECT
    DATE(created_at) as signup_date,
    COUNT(id) as count
  FROM auth.users
  GROUP BY DATE(created_at)
  ORDER BY signup_date ASC;
END;
$$;
