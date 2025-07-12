-- Activer le realtime pour les tables mcards et mcard_verification_requests
-- pour permettre aux administrateurs de voir les nouvelles cartes et demandes de vérification en temps réel

-- Configurer REPLICA IDENTITY FULL pour capturer toutes les données lors des changements
ALTER TABLE public.mcards REPLICA IDENTITY FULL;
ALTER TABLE public.mcard_verification_requests REPLICA IDENTITY FULL;

-- Ajouter les tables à la publication realtime pour activer la fonctionnalité temps réel
ALTER PUBLICATION supabase_realtime ADD TABLE public.mcards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mcard_verification_requests;