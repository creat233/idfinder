-- Corriger la politique RLS pour les demandes de rendez-vous
-- Permettre aux utilisateurs d'envoyer des messages aux propriétaires de MCards publiées

-- Supprimer l'ancienne politique
DROP POLICY IF EXISTS "Authenticated users can send messages to published mcard owners" ON public.mcard_messages;

-- Créer une nouvelle politique plus permissive
-- Un utilisateur authentifié peut envoyer un message à n'importe quel propriétaire de MCard publié
CREATE POLICY "Authenticated users can send messages to published mcard owners"
ON public.mcard_messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() 
  AND recipient_id IS NOT NULL 
  AND mcard_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.mcards 
    WHERE mcards.id = mcard_messages.mcard_id 
    AND mcards.is_published = true
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.mcard_blocked_users
    WHERE mcard_blocked_users.mcard_id = mcard_messages.mcard_id
    AND mcard_blocked_users.blocked_user_id = auth.uid()
  )
);