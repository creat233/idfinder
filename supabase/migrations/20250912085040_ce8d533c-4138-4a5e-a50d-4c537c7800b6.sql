-- Créer la table pour les signalements de cartes
CREATE TABLE public.mcard_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mcard_id UUID NOT NULL,
  reporter_id UUID,
  reporter_email TEXT,
  report_reason TEXT NOT NULL,
  report_description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  processed_by UUID,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.mcard_reports ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Utilisateurs authentifiés peuvent signaler des cartes" 
ON public.mcard_reports 
FOR INSERT 
WITH CHECK (auth.uid() = reporter_id OR reporter_id IS NULL);

CREATE POLICY "Utilisateurs peuvent voir leurs propres signalements" 
ON public.mcard_reports 
FOR SELECT 
USING (auth.uid() = reporter_id OR is_admin());

CREATE POLICY "Admins peuvent gérer tous les signalements" 
ON public.mcard_reports 
FOR ALL 
USING (is_admin());

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_mcard_reports_updated_at
BEFORE UPDATE ON public.mcard_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour les performances
CREATE INDEX idx_mcard_reports_mcard_id ON public.mcard_reports(mcard_id);
CREATE INDEX idx_mcard_reports_status ON public.mcard_reports(status);
CREATE INDEX idx_mcard_reports_created_at ON public.mcard_reports(created_at DESC);