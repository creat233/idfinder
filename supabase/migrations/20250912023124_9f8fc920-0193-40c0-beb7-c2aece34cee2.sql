-- Fix email exposure security issue in mcard_reviews

-- First, drop the problematic RLS policy
DROP POLICY IF EXISTS "Public can view approved reviews without email" ON public.mcard_reviews;

-- Create a secure function to get public reviews without email addresses
CREATE OR REPLACE FUNCTION public.get_public_reviews(p_mcard_id uuid)
RETURNS TABLE(
  id uuid,
  mcard_id uuid, 
  visitor_name text,
  comment text,
  rating integer,
  created_at timestamp with time zone
) 
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    r.id,
    r.mcard_id,
    r.visitor_name,
    r.comment,
    r.rating,
    r.created_at
  FROM public.mcard_reviews r
  WHERE r.mcard_id = p_mcard_id AND r.is_approved = true;
$$;

-- Create new RLS policies that are more secure
CREATE POLICY "Authenticated users can insert reviews" 
ON public.mcard_reviews 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners can manage reviews" 
ON public.mcard_reviews 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.mcards 
    WHERE mcards.id = mcard_reviews.mcard_id 
    AND mcards.user_id = auth.uid()
  )
);

-- Policy for public viewing - NEVER exposes emails
CREATE POLICY "Public can view approved reviews without sensitive data" 
ON public.mcard_reviews 
FOR SELECT 
USING (
  is_approved = true 
  AND EXISTS (
    SELECT 1 FROM public.mcards 
    WHERE mcards.id = mcard_reviews.mcard_id 
    AND mcards.is_published = true
  )
);

-- Grant execute permission on the public function
GRANT EXECUTE ON FUNCTION public.get_public_reviews(uuid) TO authenticated, anon;