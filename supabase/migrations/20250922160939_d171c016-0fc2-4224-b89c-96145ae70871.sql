-- Remove the overly permissive policy that allows any authenticated user to view all published mcards
DROP POLICY IF EXISTS "Authenticated users can view published verified mcards" ON public.mcards;

-- Create a more secure policy that only allows viewing through specific controlled access patterns
-- Users can still view mcards via the secure get_public_mcard_data function which filters sensitive data
CREATE POLICY "Restricted mcard access for owners and admins only" 
ON public.mcards 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR -- Owner can see their own card
  is_admin() -- Admins can see all cards
);