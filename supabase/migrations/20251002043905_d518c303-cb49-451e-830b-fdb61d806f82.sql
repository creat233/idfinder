-- Ajouter une politique pour permettre à tout le monde de voir les MCards publiées et actives
CREATE POLICY "Public can view published and active mcards"
ON public.mcards
FOR SELECT
TO public
USING (
  is_published = true 
  AND subscription_status = 'active'
);