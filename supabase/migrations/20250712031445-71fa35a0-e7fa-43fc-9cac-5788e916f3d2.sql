-- Supprimer complètement la table mcard_reviews et la recréer avec RLS correct
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Owners can view all reviews for their cards" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Owners can approve reviews for their cards" ON public.mcard_reviews;

-- Désactiver et réactiver RLS pour s'assurer qu'il n'y a pas de conflit
ALTER TABLE public.mcard_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcard_reviews ENABLE ROW LEVEL SECURITY;

-- Politique pour voir les avis approuvés (tout le monde)
CREATE POLICY "Public can view approved reviews" ON public.mcard_reviews
FOR SELECT 
USING (is_approved = true);

-- Politique pour que les utilisateurs connectés puissent créer des avis
CREATE POLICY "Authenticated users can create reviews" ON public.mcard_reviews
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Politique pour que les propriétaires voient tous leurs avis (approuvés et en attente)
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