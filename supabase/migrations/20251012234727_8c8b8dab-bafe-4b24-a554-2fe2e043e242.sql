-- Supprimer l'ancien message de test si il existe
DELETE FROM public.mcard_messages WHERE subject = 'Demande de rendez-vous' AND sender_id = '04cdcd2a-615d-4324-b555-90242f061333';

-- Créer un message de rendez-vous test avec un visiteur vers le propriétaire
INSERT INTO public.mcard_messages (
  sender_id,
  recipient_id,
  mcard_id,
  subject,
  message,
  is_read
) VALUES (
  'ee9b217c-77ce-4897-9558-b87005bccede', -- saturninsambou02@gmail.com (visiteur)
  '04cdcd2a-615d-4324-b555-90242f061333', -- baye@gmail.com (propriétaire Bayfashion)
  '1207e6c5-c486-48c6-b5c9-7f369e70d0df', -- mcard Bayfashion
  'Demande de rendez-vous',
  '📅 Nouvelle demande de rendez-vous

👤 Client: Saturnin Sambou
📧 Email: saturninsambou02@gmail.com
📱 Téléphone: +221 77 123 45 67

📆 Date souhaitée: 2025-10-15
🕐 Heure: 14:00 - 15:00

📋 Sujet: Consultation pour services de mode
💬 Message: Bonjour, je souhaite prendre un rendez-vous pour discuter de vos services de mode et style. Merci de confirmer si le créneau proposé vous convient.',
  false
);