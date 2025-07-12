-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Owners can view all reviews for their cards" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Owners can approve reviews for their cards" ON public.mcard_reviews;

-- Politique pour voir les avis approuvés (public)
CREATE POLICY "Public can view approved reviews" ON public.mcard_reviews
FOR SELECT 
USING (is_approved = true);

-- Politique pour créer des avis - SEULEMENT pour les cartes actives/publiées
CREATE POLICY "Authenticated users can create reviews for published cards" ON public.mcard_reviews
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM mcards 
    WHERE mcards.id = mcard_id 
    AND mcards.is_published = true
  )
);

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