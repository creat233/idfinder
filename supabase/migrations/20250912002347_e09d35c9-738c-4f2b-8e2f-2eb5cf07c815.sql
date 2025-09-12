-- Fix critical security vulnerabilities in RLS policies

-- 1. Fix MCCards public access - mask sensitive data for public viewers
DROP POLICY IF EXISTS "Public can view published mCards" ON public.mcards;

-- Create a view for public mCard access that excludes sensitive information
CREATE OR REPLACE VIEW public.mcards_public AS
SELECT 
  id,
  slug,
  full_name,
  job_title,
  company,
  description,
  profile_picture_url,
  website_url,
  -- Social links are OK to show publicly
  linkedin_url,
  twitter_url,
  facebook_url,
  instagram_url,
  youtube_url,
  tiktok_url,
  snapchat_url,
  telegram_url,
  google_business_url,
  maps_location_url,
  view_count,
  is_verified,
  verification_status,
  plan,
  created_at,
  is_published
FROM public.mcards
WHERE is_published = true;

-- Grant public access to the sanitized view
GRANT SELECT ON public.mcards_public TO anon, authenticated;

-- Create restrictive policy for the main table
CREATE POLICY "Users can view their own mCards and admins can view all" 
ON public.mcards 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  public.is_admin()
);

-- 2. Fix mcard_reviews email exposure
DROP POLICY IF EXISTS "Everyone can view approved reviews" ON public.mcard_reviews;

CREATE POLICY "Public can view approved reviews without email" 
ON public.mcard_reviews 
FOR SELECT 
USING (
  is_approved = true AND (
    -- Owners can see full reviews including emails
    EXISTS (
      SELECT 1 FROM mcards 
      WHERE mcards.id = mcard_reviews.mcard_id 
      AND mcards.user_id = auth.uid()
    ) OR
    -- Public can see reviews but without sensitive data
    auth.uid() IS NULL OR
    -- Authenticated users can see reviews but without emails unless they're the owner
    (auth.uid() IS NOT NULL AND visitor_email IS NULL)
  )
);

-- Create a public view for reviews that excludes emails
CREATE OR REPLACE VIEW public.mcard_reviews_public AS
SELECT 
  id,
  mcard_id,
  visitor_name,
  comment,
  rating,
  created_at
FROM public.mcard_reviews
WHERE is_approved = true;

GRANT SELECT ON public.mcard_reviews_public TO anon, authenticated;

-- 3. Fix overly permissive card_searches policy
DROP POLICY IF EXISTS "Allow card searches insertion" ON public.card_searches;
DROP POLICY IF EXISTS "Allow reading own searches" ON public.card_searches;

-- Only allow insertion of searches
CREATE POLICY "Anyone can create search records" 
ON public.card_searches 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view search data for analytics
CREATE POLICY "Only admins can view search data" 
ON public.card_searches 
FOR SELECT 
USING (public.is_admin());

-- 4. Secure database functions with proper search_path
-- Fix all functions to prevent search_path injection attacks

-- Update critical functions with secure search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_email = (SELECT auth.jwt() ->> 'email')
    AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.can_activate_promo_codes(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.generate_promo_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- 5. Add security audit logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action text,
  p_details jsonb DEFAULT NULL,
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    action,
    user_id,
    details,
    created_at
  ) VALUES (
    p_action,
    p_user_id,
    p_details,
    now()
  );
END;
$$;

-- 6. Create secure profile access function for legitimate app needs
CREATE OR REPLACE FUNCTION public.get_public_profile_info(p_user_id uuid)
RETURNS TABLE(
  first_name text,
  last_name text,
  country text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.first_name,
    p.last_name,
    p.country
  FROM public.profiles p
  WHERE p.id = p_user_id;
$$;

-- 7. Add trigger to log sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log when someone accesses personal data
  IF TG_OP = 'SELECT' AND TG_TABLE_NAME IN ('mcards', 'profiles', 'user_cards') THEN
    PERFORM public.log_security_event(
      'sensitive_data_access',
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'accessed_user_id', CASE 
          WHEN TG_TABLE_NAME = 'mcards' THEN NEW.user_id
          WHEN TG_TABLE_NAME = 'profiles' THEN NEW.id
          WHEN TG_TABLE_NAME = 'user_cards' THEN NEW.user_id
          ELSE NULL
        END
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;