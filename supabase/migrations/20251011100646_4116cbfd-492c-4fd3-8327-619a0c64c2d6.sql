-- Corriger la politique d'insertion pour mcard_messages
-- Supprimer l'ancienne politique restrictive
DROP POLICY IF EXISTS "Authenticated users can send messages to published mcard owners" ON public.mcard_messages;

-- Créer une nouvelle politique plus claire et fonctionnelle
CREATE POLICY "Users can send messages to published mcard owners"
ON public.mcard_messages
FOR INSERT
TO authenticated
WITH CHECK (
  -- L'utilisateur doit être l'expéditeur
  sender_id = auth.uid()
  -- La mCard doit être publiée et active
  AND EXISTS (
    SELECT 1 FROM public.mcards
    WHERE mcards.id = mcard_messages.mcard_id
    AND mcards.is_published = true
    AND mcards.subscription_status = 'active'
  )
  -- L'utilisateur ne doit pas être bloqué (si la table existe)
  AND NOT EXISTS (
    SELECT 1 FROM public.mcard_blocked_users
    WHERE mcard_blocked_users.mcard_id = mcard_messages.mcard_id
    AND mcard_blocked_users.blocked_user_id = auth.uid()
  )
);