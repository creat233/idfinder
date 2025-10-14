-- Modifier les policies pour mcard_statuses pour vérifier que la carte est active
DROP POLICY IF EXISTS "Users can create statuses for their own mcards" ON public.mcard_statuses;

CREATE POLICY "Users can create statuses for their own mcards"
ON public.mcard_statuses
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.mcards
    WHERE mcards.id = mcard_statuses.mcard_id
    AND mcards.user_id = auth.uid()
    AND mcards.plan IN ('premium', 'essential')
    AND mcards.subscription_status = 'active'
  )
);

-- Modifier les policies pour mcard_products pour vérifier que la carte est active
DROP POLICY IF EXISTS "Users can create products for their own mcards" ON public.mcard_products;

CREATE POLICY "Users can create products for their own mcards"
ON public.mcard_products
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.mcards
    WHERE mcards.id = mcard_products.mcard_id
    AND mcards.user_id = auth.uid()
    AND mcards.plan IN ('essential', 'premium')
    AND mcards.subscription_status = 'active'
  )
);

-- Créer une fonction pour supprimer les cartes inactives depuis 2 mois
CREATE OR REPLACE FUNCTION public.delete_inactive_mcards()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Supprimer les cartes qui ne sont pas actives depuis 2 mois
  DELETE FROM public.mcards
  WHERE subscription_status != 'active'
  AND subscription_expires_at < (NOW() - INTERVAL '2 months');
END;
$$;