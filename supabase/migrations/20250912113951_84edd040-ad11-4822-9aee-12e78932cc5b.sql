-- Ajouter une politique RLS pour permettre l'accès public aux cartes vérifiées et publiées
CREATE POLICY "Public can view verified and published mcards" 
ON public.mcards 
FOR SELECT 
USING (is_published = true AND is_verified = true);