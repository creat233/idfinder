-- Critical Security Fixes

-- 1. Fix RLS on mcard_reviews table (currently disabled)
-- First, let's ensure RLS is enabled
ALTER TABLE public.mcard_reviews ENABLE ROW LEVEL SECURITY;

-- 2. Fix search_path in all database functions for security
-- Update all functions to have proper search_path setting

-- Update generate_promo_code function
CREATE OR REPLACE FUNCTION public.generate_promo_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  code_length INTEGER := 8;
  characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
  char_pos INTEGER;
BEGIN
  FOR i IN 1..code_length LOOP
    char_pos := floor(random() * length(characters) + 1);
    result := result || substr(characters, char_pos, 1);
  END LOOP;
  
  -- Vérifier que le code n'existe pas déjà
  WHILE EXISTS (SELECT 1 FROM public.promo_codes WHERE code = result) LOOP
    result := '';
    FOR i IN 1..code_length LOOP
      char_pos := floor(random() * length(characters) + 1);
      result := result || substr(characters, char_pos, 1);
    END LOOP;
  END LOOP;
  
  RETURN result;
END;
$function$;

-- Update can_activate_promo_codes function
CREATE OR REPLACE FUNCTION public.can_activate_promo_codes(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_email = can_activate_promo_codes.user_email 
    AND ap.permission_type = 'activate_promo_codes' 
    AND ap.is_active = true
  );
END;
$function$;

-- Update is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_email = (SELECT auth.jwt() ->> 'email')
    AND is_active = true
  );
$function$;

-- Update increment_mcard_view_count function
CREATE OR REPLACE FUNCTION public.increment_mcard_view_count(mcard_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.mcards
  SET view_count = view_count + 1
  WHERE slug = mcard_slug AND is_published = true;
END;
$function$;

-- Update log_login_event function
CREATE OR REPLACE FUNCTION public.log_login_event()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    should_notify BOOLEAN;
BEGIN
    -- Vérifie si l'utilisateur souhaite recevoir des notifications de sécurité
    SELECT p.enable_security_notifications
    INTO should_notify
    FROM public.profiles p
    WHERE p.id = auth.uid();

    -- Si le profil n'existe pas ou que la colonne est nulle, la valeur par défaut est true
    IF should_notify IS NULL THEN
        should_notify := true;
    END IF;

    -- Si activé, crée une notification
    IF should_notify = true THEN
        INSERT INTO public.notifications (user_id, type, title, message)
        VALUES (
            auth.uid(),
            'security_alert',
            'Alerte de sécurité : Nouvelle connexion',
            'Une nouvelle connexion à votre compte a été détectée. Si ce n''était pas vous, veuillez changer votre mot de passe immédiatement.'
        );
    END IF;
END;
$function$;

-- 3. Add security audit logging table
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security audit logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view security audit logs
CREATE POLICY "Admins can view security audit logs" 
ON public.security_audit_logs 
FOR SELECT 
USING (public.is_admin());

-- 4. Add password strength validation function
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Password must be at least 8 characters
  IF length(password) < 8 THEN
    RETURN false;
  END IF;
  
  -- Must contain at least one uppercase letter
  IF password !~ '[A-Z]' THEN
    RETURN false;
  END IF;
  
  -- Must contain at least one lowercase letter
  IF password !~ '[a-z]' THEN
    RETURN false;
  END IF;
  
  -- Must contain at least one number
  IF password !~ '[0-9]' THEN
    RETURN false;
  END IF;
  
  -- Must contain at least one special character
  IF password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;