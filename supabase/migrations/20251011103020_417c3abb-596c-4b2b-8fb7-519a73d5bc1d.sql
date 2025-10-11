
-- S'assurer que la politique d'insertion existe et est correcte
DROP POLICY IF EXISTS "Allow authenticated users to send messages" ON public.mcard_messages;

-- Créer une politique qui permet à TOUS les utilisateurs authentifiés d'envoyer des messages
CREATE POLICY "Allow authenticated users to send messages"
ON public.mcard_messages
FOR INSERT
TO authenticated
WITH CHECK (
  -- L'utilisateur doit être l'expéditeur
  sender_id = auth.uid()
  -- Le destinataire doit exister  
  AND recipient_id IS NOT NULL
  -- La mCard doit exister (sans restriction de statut)
  AND EXISTS (
    SELECT 1 FROM public.mcards
    WHERE mcards.id = mcard_messages.mcard_id
  )
);

-- Créer un message test de demande de rendez-vous pour tester
-- Note: Ceci sera exécuté en tant que service_role donc pas de problème RLS
DO $$
DECLARE
  v_mcard_id uuid;
  v_owner_id uuid;
  v_visitor_id uuid;
BEGIN
  -- Récupérer une mCard publiée
  SELECT id, user_id INTO v_mcard_id, v_owner_id
  FROM public.mcards
  WHERE is_published = true
  LIMIT 1;

  -- Créer un utilisateur visiteur fictif pour le test (ou utiliser l'owner pour simuler)
  v_visitor_id := v_owner_id;

  -- Insérer un message de demande de rendez-vous
  IF v_mcard_id IS NOT NULL THEN
    INSERT INTO public.mcard_messages (
      sender_id,
      recipient_id,
      mcard_id,
      subject,
      message,
      is_read
    ) VALUES (
      v_visitor_id,
      v_owner_id,
      v_mcard_id,
      'Demande de rendez-vous',
      '📅 Nouvelle demande de rendez-vous

👤 Client: Jean Dupont
📧 Email: jean.dupont@example.com
📱 Téléphone: +221 77 123 45 67

📆 Date souhaitée: 2025-10-15
🕐 Heure: 14:00 - 15:00

📋 Sujet: Consultation professionnelle
💬 Message: Bonjour, je souhaite prendre un rendez-vous pour discuter de vos services. Merci de confirmer si le créneau proposé vous convient.',
      false
    );
  END IF;
END $$;
