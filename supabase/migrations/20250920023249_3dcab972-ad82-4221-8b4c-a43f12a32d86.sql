-- Remove the vulnerable public read policy for promo codes
DROP POLICY IF EXISTS "Everyone can validate a promo code by code if actif, payé et n" ON public.promo_codes;

-- Create a secure promo code validation function that doesn't expose code details
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

-- Create a more restrictive policy for promo code validation
-- Only allow reading specific fields for validation purposes through the secure function
CREATE POLICY "Secure promo code validation only" 
ON public.promo_codes 
FOR SELECT 
USING (false); -- No direct SELECT access

-- Ensure users can still manage their own codes
-- (This policy should already exist but let's make sure)
DROP POLICY IF EXISTS "Users can view their own promo codes" ON public.promo_codes;
CREATE POLICY "Users can view their own promo codes" 
ON public.promo_codes 
FOR SELECT 
USING (auth.uid() = user_id);

-- Ensure admins can still manage all codes
-- (This policy should already exist but let's make sure)
DROP POLICY IF EXISTS "Admins can view all promo codes" ON public.promo_codes;
CREATE POLICY "Admins can view all promo codes" 
ON public.promo_codes 
FOR SELECT 
USING (is_admin());