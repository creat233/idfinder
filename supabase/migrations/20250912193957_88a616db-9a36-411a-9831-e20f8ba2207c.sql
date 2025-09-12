-- Permettre l'accès public aux cartes vérifiées et publiées sur la page des MCards vérifiées
DROP POLICY IF EXISTS "Public can view verified and published mcards" ON public.mcards;

CREATE POLICY "Public can view verified and published mcards"
ON public.mcards
FOR SELECT
TO public
USING (
  is_published = true 
  AND is_verified = true 
  AND subscription_status != 'expired'
);