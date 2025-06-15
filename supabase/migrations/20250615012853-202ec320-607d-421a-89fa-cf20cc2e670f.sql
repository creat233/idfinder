
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_email = 'mouhamed110000@gmail.com' AND permission_type = 'activate_promo_codes'
  ) THEN
    INSERT INTO public.admin_permissions (user_email, permission_type, is_active)
    VALUES ('mouhamed110000@gmail.com', 'activate_promo_codes', true);
  END IF;
END $$;
