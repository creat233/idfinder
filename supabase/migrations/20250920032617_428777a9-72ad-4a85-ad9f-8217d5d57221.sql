-- CRITICAL SECURITY FIX: Remove overly permissive profile access policy
DROP POLICY IF EXISTS "Limited profile access for app functionality" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

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