
-- Supprimer et recréer la politique d'insertion avec une condition plus permissive
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.mcard_reviews;

-- Nouvelle politique d'insertion plus permissive pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can create reviews" ON public.mcard_reviews
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM mcards 
    WHERE mcards.id = mcard_reviews.mcard_id 
    AND mcards.is_published = true
  )
);
