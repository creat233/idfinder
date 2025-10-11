-- Mettre à jour la politique pour autoriser l'envoi de messages aux mCards publiées
-- indépendamment du statut d'abonnement (pour les tests)
DROP POLICY IF EXISTS "Users can send messages to published mcard owners" ON public.mcard_messages;

CREATE POLICY "Users can send messages to published mcard owners"
ON public.mcard_messages
FOR INSERT
TO authenticated
WITH CHECK (
  -- L'utilisateur doit être l'expéditeur
  sender_id = auth.uid()
  -- Le destinataire doit exister
  AND recipient_id IS NOT NULL
  -- La mCard doit exister et être publiée
  AND EXISTS (
    SELECT 1 FROM public.mcards
    WHERE mcards.id = mcard_messages.mcard_id
    AND mcards.is_published = true
  )
  -- L'utilisateur ne doit pas être bloqué
  AND NOT EXISTS (
    SELECT 1 FROM public.mcard_blocked_users
    WHERE mcard_blocked_users.mcard_id = mcard_messages.mcard_id
    AND mcard_blocked_users.blocked_user_id = auth.uid()
  )
);