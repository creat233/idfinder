-- Activer le realtime pour la table mcard_verification_requests
-- pour permettre aux administrateurs de voir les nouvelles demandes de vérification en temps réel

-- Configurer REPLICA IDENTITY FULL pour capturer toutes les données lors des changements
ALTER TABLE public.mcard_verification_requests REPLICA IDENTITY FULL;

-- Ajouter la table à la publication realtime pour activer la fonctionnalité temps réel
ALTER PUBLICATION supabase_realtime ADD TABLE public.mcard_verification_requests;