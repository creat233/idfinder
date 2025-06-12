
-- Corriger la fonction can_activate_promo_codes pour éliminer l'ambiguïté
CREATE OR REPLACE FUNCTION public.can_activate_promo_codes(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_email = can_activate_promo_codes.user_email 
    AND ap.permission_type = 'activate_promo_codes' 
    AND ap.is_active = true
  );
END;
$$;
