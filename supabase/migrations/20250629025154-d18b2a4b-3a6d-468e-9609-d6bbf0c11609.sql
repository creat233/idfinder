
-- First drop the existing function
DROP FUNCTION IF EXISTS public.admin_get_pending_mcards();

-- Then create the updated function with the slug field
CREATE OR REPLACE FUNCTION public.admin_get_pending_mcards()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  plan text,
  created_at timestamptz,
  user_email text,
  user_phone text,
  slug text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    m.id,
    m.user_id,
    m.full_name,
    m.plan,
    m.created_at,
    u.email AS user_email,
    p.phone AS user_phone,
    m.slug
  FROM public.mcards m
  JOIN auth.users u ON m.user_id = u.id
  LEFT JOIN public.profiles p ON m.user_id = p.id
  WHERE m.subscription_status = 'pending_payment'
  ORDER BY m.created_at ASC;
END;
$$;
