-- Supprimer l'ancienne politique qui bloque les insertions
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.mcard_reviews;

-- Créer une nouvelle politique qui permet aux utilisateurs connectés de créer des avis
CREATE POLICY "Authenticated users can create reviews" ON public.mcard_reviews
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);