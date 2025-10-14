-- Améliorer la RLS policy pour permettre aux cartes premium et essential d'ajouter des statuts
-- et ajouter une fonction pour limiter les statuts à 30 par jour

-- Supprimer l'ancienne policy
DROP POLICY IF EXISTS "Users can create statuses for their own mcards" ON public.mcard_statuses;

-- Créer une nouvelle policy qui autorise les plans premium et essential
CREATE POLICY "Users can create statuses for their own mcards"
ON public.mcard_statuses
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.mcards
    WHERE mcards.id = mcard_statuses.mcard_id
    AND mcards.user_id = auth.uid()
    AND mcards.plan IN ('premium', 'essential')
  )
);

-- Créer une fonction pour compter les statuts créés aujourd'hui
CREATE OR REPLACE FUNCTION public.count_statuses_created_today(p_mcard_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.mcard_statuses
  WHERE mcard_id = p_mcard_id
  AND DATE(created_at) = CURRENT_DATE;
$$;

-- Créer une fonction pour vérifier si l'utilisateur peut ajouter un statut
CREATE OR REPLACE FUNCTION public.can_add_status_today(p_mcard_id UUID)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan TEXT;
  v_count INTEGER;
  v_limit INTEGER;
BEGIN
  -- Récupérer le plan de la carte
  SELECT plan INTO v_plan
  FROM public.mcards
  WHERE id = p_mcard_id
  AND user_id = auth.uid();
  
  IF v_plan IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Définir la limite selon le plan
  v_limit := CASE v_plan
    WHEN 'essential' THEN 15
    WHEN 'premium' THEN 30
    WHEN 'ultimate' THEN 50
    ELSE 0
  END;
  
  -- Compter les statuts créés aujourd'hui
  v_count := public.count_statuses_created_today(p_mcard_id);
  
  -- Vérifier si on est sous la limite
  RETURN v_count < v_limit;
END;
$$;