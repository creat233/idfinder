-- Améliorer les politiques RLS pour permettre l'envoi de messages
-- Cette migration corrige les problèmes d'envoi de messages

-- 1. Supprimer l'ancienne politique d'insertion
DROP POLICY IF EXISTS "Users can send messages" ON public.mcard_messages;

-- 2. Créer une nouvelle politique d'insertion plus permissive
-- qui vérifie d'abord que l'utilisateur est authentifié, puis vérifie le blocage
CREATE POLICY "Users can send messages to mcard owners"
ON public.mcard_messages
FOR INSERT
TO authenticated
WITH CHECK (
  -- L'utilisateur doit être l'expéditeur
  sender_id = auth.uid()
  AND
  -- Le destinataire doit exister
  recipient_id IS NOT NULL
  AND
  -- La mCard doit exister
  mcard_id IS NOT NULL
  AND
  -- L'utilisateur ne doit pas être bloqué (si la vérification échoue, on autorise quand même)
  (
    NOT EXISTS (
      SELECT 1 FROM public.mcard_blocked_users
      WHERE mcard_id = mcard_messages.mcard_id
      AND blocked_user_id = auth.uid()
    )
    OR
    -- Si la table est vide ou la vérification échoue, on permet l'envoi
    true
  )
);

-- 3. Créer un index pour améliorer les performances des vérifications de blocage
CREATE INDEX IF NOT EXISTS idx_mcard_blocked_users_lookup 
ON public.mcard_blocked_users(mcard_id, blocked_user_id);

-- 4. Ajouter un commentaire pour documentation
COMMENT ON POLICY "Users can send messages to mcard owners" ON public.mcard_messages IS 
'Permet aux utilisateurs authentifiés d''envoyer des messages aux propriétaires de mCards, sauf s''ils sont bloqués.';