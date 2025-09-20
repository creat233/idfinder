-- CRITICAL SECURITY FIX: Remove overly permissive profile access policy
DROP POLICY IF EXISTS "Limited profile access for app functionality" ON public.profiles;

-- Create a more restrictive policy that only allows users to view their own profiles
CREATE POLICY "Users can only view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow admins to view all profiles (separate policy for clarity)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin());

-- Create a secure function for limited public profile access (only safe data)
CREATE OR REPLACE FUNCTION public.get_safe_profile_info(p_user_id uuid)
RETURNS TABLE(first_name text, country text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.first_name,
    p.country
  FROM public.profiles p
  WHERE p.id = p_user_id;
$$;

-- SECURITY FIX: Add proper search path to existing security definer functions
-- Fix the get_public_profile_info function
CREATE OR REPLACE FUNCTION public.get_public_profile_info(p_user_id uuid)
RETURNS TABLE(first_name text, last_name text, country text)
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

-- SECURITY FIX: Add rate limiting and validation to card searches
-- Create a function to validate and rate limit card searches
CREATE OR REPLACE FUNCTION public.create_card_search_secure(
  p_card_number text,
  p_searcher_email text DEFAULT NULL,
  p_searcher_phone text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  search_id uuid;
  recent_searches_count integer;
BEGIN
  -- Rate limiting: Check for recent searches from the same source
  IF p_searcher_email IS NOT NULL THEN
    SELECT COUNT(*) INTO recent_searches_count
    FROM public.card_searches
    WHERE searcher_email = p_searcher_email 
    AND created_at > NOW() - INTERVAL '1 hour';
    
    IF recent_searches_count >= 10 THEN
      RAISE EXCEPTION 'Too many searches from this email. Please try again later.';
    END IF;
  END IF;
  
  -- Validate card number format (basic validation)
  IF LENGTH(p_card_number) < 3 OR LENGTH(p_card_number) > 50 THEN
    RAISE EXCEPTION 'Invalid card number format';
  END IF;
  
  -- Validate email format if provided
  IF p_searcher_email IS NOT NULL AND p_searcher_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Insert the search record
  INSERT INTO public.card_searches (card_number, searcher_email, searcher_phone)
  VALUES (p_card_number, p_searcher_email, p_searcher_phone)
  RETURNING id INTO search_id;
  
  RETURN search_id;
END;
$$;

-- SECURITY FIX: Update all existing security definer functions to have proper search paths
-- Fix generate_promo_code function
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

-- Fix validate_promo_code_secure function
CREATE OR REPLACE FUNCTION public.validate_promo_code_secure(code_to_validate text)
RETURNS TABLE(is_valid boolean, discount_amount numeric, user_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code_record RECORD;
BEGIN
  -- Find the promo code without exposing it publicly
  SELECT 
    pc.id,
    pc.user_id,
    pc.is_active,
    pc.is_paid,
    pc.expires_at,
    1000 as discount_amount -- Fixed discount amount
  INTO code_record
  FROM public.promo_codes pc
  WHERE pc.code = code_to_validate;
  
  -- Check if code exists and is valid
  IF code_record.id IS NOT NULL 
     AND code_record.is_active = true 
     AND code_record.is_paid = true 
     AND code_record.expires_at > now() THEN
    RETURN QUERY SELECT true, code_record.discount_amount, code_record.user_id;
  ELSE
    RETURN QUERY SELECT false, 0::numeric, null::uuid;
  END IF;
END;
$$;