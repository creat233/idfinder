-- Supprimer l'ancienne politique restrictive pour l'insertion de messages
DROP POLICY IF EXISTS "Allow authenticated users to send messages" ON public.mcard_messages;

-- Créer une nouvelle politique plus permissive pour permettre à tous les utilisateurs authentifiés d'envoyer des messages
CREATE POLICY "Authenticated users can send messages to any mcard"
ON public.mcard_messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() 
  AND recipient_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.mcards 
    WHERE mcards.id = mcard_messages.mcard_id 
    AND mcards.is_published = true
  )
);

-- Ajouter un commentaire pour documenter la politique
COMMENT ON POLICY "Authenticated users can send messages to any mcard" ON public.mcard_messages 
IS 'Permet aux utilisateurs authentifiés d''envoyer des messages et demandes de rendez-vous à toutes les cartes publiées, sans restriction de blocage';