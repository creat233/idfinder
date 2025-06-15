
-- 1. Créer la table pour les journaux d'audit
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT
);

-- Index pour optimiser les recherches
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);

-- Commentaire sur la table pour la documentation
COMMENT ON TABLE public.audit_logs IS 'Enregistre les actions importantes pour l''audit et la sécurité.';

-- 2. Activer RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. Politique RLS : Seuls les admins peuvent lire.
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (public.is_admin());

-- NOTE: Aucune politique pour INSERT, UPDATE, DELETE.
-- Les logs seront insérés uniquement via des fonctions internes sécurisées (triggers).

-- 4. Fonction pour récupérer les logs d'audit pour l'interface admin
CREATE OR REPLACE FUNCTION public.get_audit_logs()
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  user_email TEXT,
  action TEXT,
  details JSONB,
  ip_address TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier si l'utilisateur est un administrateur
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    al.id,
    al.created_at,
    al.user_email,
    al.action,
    al.details,
    al.ip_address
  FROM public.audit_logs al
  ORDER BY al.created_at DESC
  LIMIT 100; -- Limite pour ne pas surcharger l'interface
END;
$$;
