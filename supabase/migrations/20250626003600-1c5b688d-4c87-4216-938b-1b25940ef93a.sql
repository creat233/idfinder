
-- Activer les mises à jour en temps réel pour les tables principales
ALTER TABLE public.mcards REPLICA IDENTITY FULL;
ALTER TABLE public.mcard_statuses REPLICA IDENTITY FULL;
ALTER TABLE public.mcard_products REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Ajouter les tables à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.mcards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mcard_statuses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mcard_products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Créer les politiques RLS manquantes pour mcard_statuses
CREATE POLICY "Users can view statuses of their own mcards" 
  ON public.mcard_statuses 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.mcards 
      WHERE mcards.id = mcard_statuses.mcard_id 
      AND mcards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create statuses for their own mcards" 
  ON public.mcard_statuses 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mcards 
      WHERE mcards.id = mcard_statuses.mcard_id 
      AND mcards.user_id = auth.uid()
      AND mcards.plan = 'premium'
    )
  );

CREATE POLICY "Users can update statuses of their own mcards" 
  ON public.mcard_statuses 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.mcards 
      WHERE mcards.id = mcard_statuses.mcard_id 
      AND mcards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete statuses of their own mcards" 
  ON public.mcard_statuses 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.mcards 
      WHERE mcards.id = mcard_statuses.mcard_id 
      AND mcards.user_id = auth.uid()
    )
  );

-- Créer les politiques RLS pour mcard_products
CREATE POLICY "Users can view products of their own mcards" 
  ON public.mcard_products 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.mcards 
      WHERE mcards.id = mcard_products.mcard_id 
      AND mcards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create products for their own mcards" 
  ON public.mcard_products 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mcards 
      WHERE mcards.id = mcard_products.mcard_id 
      AND mcards.user_id = auth.uid()
      AND mcards.plan = 'premium'
    )
  );

CREATE POLICY "Users can update products of their own mcards" 
  ON public.mcard_products 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.mcards 
      WHERE mcards.id = mcard_products.mcard_id 
      AND mcards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete products of their own mcards" 
  ON public.mcard_products 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.mcards 
      WHERE mcards.id = mcard_products.mcard_id 
      AND mcards.user_id = auth.uid()
    )
  );

-- Activer RLS sur les tables
ALTER TABLE public.mcard_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcard_products ENABLE ROW LEVEL SECURITY;

-- Ajouter une colonne expires_at à mcard_statuses pour les statuts temporaires
ALTER TABLE public.mcard_statuses ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '24 hours');

-- Ajouter une colonne status_image à mcard_statuses pour les images de statut
ALTER TABLE public.mcard_statuses ADD COLUMN IF NOT EXISTS status_image TEXT;
