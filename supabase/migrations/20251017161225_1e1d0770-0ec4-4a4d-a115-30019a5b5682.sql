-- Mettre à jour les politiques RLS pour les devis afin d'inclure le plan 'ultimate'

-- Supprimer l'ancienne politique de création
DROP POLICY IF EXISTS "Users can create quotes for their own mcards" ON mcard_quotes;

-- Créer la nouvelle politique avec le plan ultimate
CREATE POLICY "Users can create quotes for their own mcards"
ON mcard_quotes
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM mcards
    WHERE mcards.id = mcard_quotes.mcard_id
    AND mcards.user_id = auth.uid()
    AND mcards.plan IN ('essential', 'premium', 'ultimate')
  )
);