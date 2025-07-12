-- Supprimer l'ancienne politique restrictive
DROP POLICY IF EXISTS "Users can manage blocked users for their own mcards" ON mcard_blocked_users;

-- Créer une nouvelle politique pour permettre aux utilisateurs de bloquer ceux qui leur envoient des messages
CREATE POLICY "Users can block users who message them" 
ON mcard_blocked_users 
FOR INSERT 
WITH CHECK (
  -- L'utilisateur actuel peut bloquer quelqu'un s'il a reçu un message de cette personne
  EXISTS (
    SELECT 1 
    FROM mcard_messages mm
    WHERE mm.sender_id = mcard_blocked_users.blocked_user_id 
    AND mm.recipient_id = auth.uid()
    AND mm.mcard_id = mcard_blocked_users.mcard_id
  )
);

-- Politique pour voir les utilisateurs bloqués
CREATE POLICY "Users can view their blocked users" 
ON mcard_blocked_users 
FOR SELECT 
USING (
  -- L'utilisateur peut voir qui il a bloqué en tant que destinataire de messages
  EXISTS (
    SELECT 1 
    FROM mcard_messages mm
    WHERE mm.recipient_id = auth.uid()
    AND mm.mcard_id = mcard_blocked_users.mcard_id
  )
);

-- Politique pour débloquer
CREATE POLICY "Users can unblock users they blocked" 
ON mcard_blocked_users 
FOR DELETE 
USING (
  -- L'utilisateur peut débloquer quelqu'un qu'il a bloqué
  EXISTS (
    SELECT 1 
    FROM mcard_messages mm
    WHERE mm.sender_id = mcard_blocked_users.blocked_user_id 
    AND mm.recipient_id = auth.uid()
    AND mm.mcard_id = mcard_blocked_users.mcard_id
  )
);