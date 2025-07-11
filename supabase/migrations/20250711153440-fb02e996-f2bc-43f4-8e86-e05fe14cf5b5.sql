-- Permettre aux utilisateurs de supprimer leurs propres messages
CREATE POLICY "Users can delete their own sent messages" 
ON public.mcard_messages 
FOR DELETE 
USING (sender_id = auth.uid());