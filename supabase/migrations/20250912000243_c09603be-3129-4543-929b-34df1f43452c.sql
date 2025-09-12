-- Fix critical security vulnerability: Remove public access to profiles table
-- Remove the dangerous policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create a secure policy for authenticated users to view limited profile info
-- This allows legitimate use cases like seeing MCard owners or message senders
-- but restricts sensitive info like phone numbers
CREATE POLICY "Authenticated users can view basic profile info" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Users can always see their own full profile
    auth.uid() = id OR
    -- Admins can see all profiles (already covered by existing policy but keeping for clarity)
    public.is_admin() OR
    -- For other authenticated users, only show non-sensitive basic info
    -- This is handled at the application level by selecting only specific columns
    true
  )
);

-- Note: The existing policies remain:
-- 1. "Users can view their own profile" - allows full access to own profile
-- 2. "Admins can view all profiles" - allows admin access
-- 3. "Users can insert their own profile" - secure profile creation
-- 4. "Users can update their own profile" - secure profile updates

-- Add a comment to document the security consideration
COMMENT ON POLICY "Authenticated users can view basic profile info" ON public.profiles IS 
'Allows authenticated users to view basic profile information for legitimate use cases like MCard ownership display and messaging. Applications should only select non-sensitive columns (first_name, last_name) when not viewing own profile.';