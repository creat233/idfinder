
-- S'assurer que les permissions d'administration sont en place
INSERT INTO public.admin_permissions (user_email, permission_type, is_active)
VALUES ('mouhamed110000@gmail.com', 'activate_promo_codes', true)
ON CONFLICT (user_email, permission_type) 
DO UPDATE SET is_active = true, updated_at = now();
