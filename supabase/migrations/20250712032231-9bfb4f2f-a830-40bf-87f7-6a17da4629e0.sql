-- Supprimer complètement RLS et recommencer
ALTER TABLE public.mcard_reviews DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews for published cards" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Owners can view all reviews for their cards" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Owners can approve reviews for their cards" ON public.mcard_reviews;

-- Réactiver RLS
ALTER TABLE public.mcard_reviews ENABLE ROW LEVEL SECURITY;

-- Politique ultra simple pour l'insertion - tout utilisateur connecté peut insérer
CREATE POLICY "Allow authenticated users to insert reviews" ON public.mcard_reviews
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour voir les avis approuvés (public)
CREATE POLICY "Allow public to view approved reviews" ON public.mcard_reviews
FOR SELECT 
USING (is_approved = true);

-- Politique pour que les propriétaires voient tous leurs avis
CREATE POLICY "Allow owners to view all their reviews" ON public.mcard_reviews
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM mcards 
    WHERE mcards.id = mcard_reviews.mcard_id 
    AND mcards.user_id = auth.uid()
  )
);

-- Politique pour que les propriétaires puissent approuver
CREATE POLICY "Allow owners to update their reviews" ON public.mcard_reviews
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM mcards 
    WHERE mcards.id = mcard_reviews.mcard_id 
    AND mcards.user_id = auth.uid()
  )
);