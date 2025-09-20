-- Remove the public access policy that exposes sensitive contact information
DROP POLICY IF EXISTS "Public can view verified and published mcards" ON public.mcards;

-- Create a more restrictive policy that only allows authenticated users to view published mcards
CREATE POLICY "Authenticated users can view published verified mcards" 
ON public.mcards 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND is_published = true 
  AND is_verified = true 
  AND subscription_status <> 'expired'::text
);

-- Ensure the public function for mcard data remains available for unauthenticated access
-- This function already excludes sensitive contact information (phone_number, email)
-- and only returns safe public data