-- Supprimer la politique actuelle restrictive
DROP POLICY IF EXISTS "Users can send messages to published mcard owners" ON public.mcard_messages;

-- Créer une politique beaucoup plus permissive pour les messages et rendez-vous
CREATE POLICY "Allow authenticated users to send messages"
ON public.mcard_messages
FOR INSERT
TO authenticated
WITH CHECK (
  -- L'utilisateur doit être l'expéditeur
  sender_id = auth.uid()
  -- Le destinataire doit exister  
  AND recipient_id IS NOT NULL
  -- La mCard doit exister
  AND EXISTS (
    SELECT 1 FROM public.mcards
    WHERE mcards.id = mcard_messages.mcard_id
  )
);