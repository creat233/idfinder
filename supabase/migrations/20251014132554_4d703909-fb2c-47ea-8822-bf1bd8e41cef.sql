-- Ajouter une politique RLS pour permettre à tout le monde de voir les cartes signalées
CREATE POLICY "Public peut voir toutes les cartes signalées"
ON public.reported_cards
FOR SELECT
TO public
USING (true);