-- Table pour suivre les visites anonymes de l'application
CREATE TABLE IF NOT EXISTS public.app_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour les requêtes d'analytics
CREATE INDEX IF NOT EXISTS idx_app_visits_created_at ON public.app_visits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_visits_visitor_id ON public.app_visits (visitor_id);
CREATE INDEX IF NOT EXISTS idx_app_visits_page_path ON public.app_visits (page_path);

-- Activer RLS
ALTER TABLE public.app_visits ENABLE ROW LEVEL SECURITY;

-- Permettre à tout le monde d'insérer (visiteurs anonymes)
CREATE POLICY "Anyone can insert visits" 
ON public.app_visits 
FOR INSERT 
WITH CHECK (true);

-- Seuls les admins peuvent lire les visites
CREATE POLICY "Only admins can read visits" 
ON public.app_visits 
FOR SELECT 
USING (public.is_admin());

-- Fonction pour obtenir les statistiques de visites quotidiennes
CREATE OR REPLACE FUNCTION public.get_daily_app_visits(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  visit_date DATE,
  total_visits BIGINT,
  unique_visitors BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin only';
  END IF;

  RETURN QUERY
  SELECT 
    DATE(av.created_at) as visit_date,
    COUNT(*) as total_visits,
    COUNT(DISTINCT av.visitor_id) as unique_visitors
  FROM public.app_visits av
  WHERE av.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY DATE(av.created_at)
  ORDER BY visit_date DESC;
END;
$$;