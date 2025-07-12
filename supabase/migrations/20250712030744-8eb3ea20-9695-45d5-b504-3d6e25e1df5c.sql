-- Supprimer toutes les anciennes politiques pour les recréer proprement
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Owners can update their reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Owners can view all their reviews" ON public.mcard_reviews;

-- Politique pour voir les avis approuvés (public)
CREATE POLICY "Public can view approved reviews" ON public.mcard_reviews
FOR SELECT 
USING (is_approved = true);

-- Politique pour que les utilisateurs connectés puissent créer des avis
CREATE POLICY "Authenticated users can create reviews" ON public.mcard_reviews
FOR INSERT 
TO authenticated
WITH CHECK (
  -- L'utilisateur doit être connecté
  auth.uid() IS NOT NULL
  -- Et ne peut pas créer plus de 7 avis pour cette carte
  AND (
    SELECT count(*) 
    FROM mcard_reviews 
    WHERE mcard_id = NEW.mcard_id
  ) < 7
);

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