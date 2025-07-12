-- Remettre RLS avec des politiques très simples qui fonctionnent
ALTER TABLE public.mcard_reviews ENABLE ROW LEVEL SECURITY;

-- Politique simple : Tout le monde peut voir les avis approuvés
CREATE POLICY "Everyone can view approved reviews" ON public.mcard_reviews
FOR SELECT 
USING (is_approved = true);

-- Politique simple : Utilisateurs connectés peuvent créer des avis
CREATE POLICY "Authenticated users can insert reviews" ON public.mcard_reviews
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Politique simple : Propriétaires voient tout et peuvent modifier
CREATE POLICY "Owners can manage reviews" ON public.mcard_reviews
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM mcards 
    WHERE mcards.id = mcard_reviews.mcard_id 
    AND mcards.user_id = auth.uid()
  )
);