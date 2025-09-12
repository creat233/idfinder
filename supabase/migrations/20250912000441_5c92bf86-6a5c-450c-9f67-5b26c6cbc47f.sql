-- Fix the overly permissive profile access policy
-- The current policy has "OR true" which allows anyone to access all profiles
DROP POLICY IF EXISTS "Authenticated users can view basic profile info" ON public.profiles;

-- Create a properly restrictive policy that only allows legitimate access patterns
CREATE POLICY "Limited profile access for app functionality" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Users can always see their own full profile
    auth.uid() = id OR
    -- Admins can see all profiles
    public.is_admin()
    -- Removed the "OR true" that was making this completely permissive
  )
);

-- For legitimate app functionality (like viewing MCard owners), 
-- the application should use specific service functions or admin queries
-- rather than direct table access with overly broad permissions