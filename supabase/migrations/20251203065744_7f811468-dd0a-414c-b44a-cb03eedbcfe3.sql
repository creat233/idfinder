-- Mettre à jour la politique RLS pour permettre aux plans gratuits d'ajouter des produits (max 5)
DROP POLICY IF EXISTS "Users can create products for their own mcards" ON mcard_products;

CREATE POLICY "Users can create products for their own mcards" 
ON mcard_products 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM mcards
    WHERE mcards.id = mcard_products.mcard_id 
    AND mcards.user_id = auth.uid() 
    AND mcards.plan IN ('free', 'essential', 'premium', 'ultimate')
    AND mcards.subscription_status IN ('active', 'trial')
  )
);

-- Mettre à jour la politique RLS pour permettre aux plans gratuits d'ajouter des statuts (max 5)
DROP POLICY IF EXISTS "Users can create statuses for their own mcards" ON mcard_statuses;

CREATE POLICY "Users can create statuses for their own mcards" 
ON mcard_statuses 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM mcards
    WHERE mcards.id = mcard_statuses.mcard_id 
    AND mcards.user_id = auth.uid() 
    AND mcards.plan IN ('free', 'essential', 'premium', 'ultimate')
    AND mcards.subscription_status IN ('active', 'trial')
  )
);