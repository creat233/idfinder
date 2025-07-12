
-- Solution temporaire : Désactiver complètement RLS pour tester et réinitialiser
ALTER TABLE public.mcard_reviews DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes pour repartir à zéro
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Owners can view all reviews for their cards" ON public.mcard_reviews;
DROP POLICY IF EXISTS "Owners can approve reviews for their cards" ON public.mcard_reviews;

-- Réactiver RLS
ALTER TABLE public.mcard_reviews ENABLE ROW LEVEL SECURITY;

-- Créer des politiques ultra-simples qui fonctionnent
CREATE POLICY "Everyone can view approved reviews" ON public.mcard_reviews
FOR SELECT 
USING (is_approved = true);

-- Politique très simple pour l'insertion - tout utilisateur authentifié peut insérer
CREATE POLICY "Authenticated users can insert reviews" ON public.mcard_reviews
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour que les propriétaires voient tout et peuvent modifier
CREATE POLICY "Owners can manage reviews" ON public.mcard_reviews
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM mcards 
    WHERE mcards.id = mcard_reviews.mcard_id 
    AND mcards.user_id = auth.uid()
  )
);
