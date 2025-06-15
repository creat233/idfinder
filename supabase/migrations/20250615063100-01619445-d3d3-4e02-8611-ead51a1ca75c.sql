
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  is_admin_user boolean;
BEGIN
  -- This is necessary to bypass RLS on admin_permissions table,
  -- as the policy on that table calls this function, creating a recursion.
  -- The `is_local` flag (third argument) ensures this setting is
  -- only for the current transaction.
  PERFORM set_config('security.bypass_rls', 'on', true);

  SELECT EXISTS (
    SELECT 1
    FROM public.admin_permissions
    WHERE user_email = auth.jwt()->>'email'
    AND is_active = true
  ) INTO is_admin_user;
  
  RETURN is_admin_user;
END;
$function$;
