
-- Supprimer toutes les politiques existantes sur mcard_reviews
DROP POLICY IF EXISTS "Allow authenticated users to insert reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Allow owners to update their reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Allow owners to view all their reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Allow public to view approved reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Everyone can view approved reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Owners can manage reviews" ON public.mcard_reviews;

-- Créer des politiques très simples et claires
CREATE POLICY "Public can view approved reviews" ON public.mcard_reviews
FOR SELECT 
USING (is_approved = true);

-- Politique pour permettre aux utilisateurs connectés de créer des avis
CREATE POLICY "Authenticated users can create reviews" ON public.mcard_reviews
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour que les propriétaires voient tous leurs avis
CREATE POLICY "Owners can view all reviews for their cards" ON public.mcard_reviews
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM mcards 
    WHERE mcards.id = mcard_reviews.mcard_id 
    AND mcards.user_id = auth.uid()
  )
);

-- Politique pour que les propriétaires puissent approuver les avis
CREATE POLICY "Owners can approve reviews for their cards" ON public.mcard_reviews
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM mcards 
    WHERE mcards.id = mcard_reviews.mcard_id 
    AND mcards.user_id = auth.uid()
  )
);
