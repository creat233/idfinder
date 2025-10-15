-- Créer la table pour les devis
CREATE TABLE IF NOT EXISTS public.mcard_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  quote_number TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  status TEXT NOT NULL DEFAULT 'draft',
  valid_until DATE,
  issued_date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(quote_number)
);

-- Créer la table pour les items des devis
CREATE TABLE IF NOT EXISTS public.mcard_quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.mcard_quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mcard_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcard_quote_items ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les devis
CREATE POLICY "Users can view quotes for their own mcards"
  ON public.mcard_quotes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.mcards
      WHERE mcards.id = mcard_quotes.mcard_id
      AND mcards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create quotes for their own mcards"
  ON public.mcard_quotes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mcards
      WHERE mcards.id = mcard_quotes.mcard_id
      AND mcards.user_id = auth.uid()
      AND mcards.plan IN ('essential', 'premium')
    )
  );

CREATE POLICY "Users can update quotes for their own mcards"
  ON public.mcard_quotes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.mcards
      WHERE mcards.id = mcard_quotes.mcard_id
      AND mcards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete quotes for their own mcards"
  ON public.mcard_quotes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.mcards
      WHERE mcards.id = mcard_quotes.mcard_id
      AND mcards.user_id = auth.uid()
    )
  );

-- Politiques RLS pour les items des devis
CREATE POLICY "Users can view quote items for their own mcards"
  ON public.mcard_quote_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.mcard_quotes mq
      JOIN public.mcards m ON m.id = mq.mcard_id
      WHERE mq.id = mcard_quote_items.quote_id
      AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create quote items for their own mcards"
  ON public.mcard_quote_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mcard_quotes mq
      JOIN public.mcards m ON m.id = mq.mcard_id
      WHERE mq.id = mcard_quote_items.quote_id
      AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update quote items for their own mcards"
  ON public.mcard_quote_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.mcard_quotes mq
      JOIN public.mcards m ON m.id = mq.mcard_id
      WHERE mq.id = mcard_quote_items.quote_id
      AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete quote items for their own mcards"
  ON public.mcard_quote_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.mcard_quotes mq
      JOIN public.mcards m ON m.id = mq.mcard_id
      WHERE mq.id = mcard_quote_items.quote_id
      AND m.user_id = auth.uid()
    )
  );

-- Créer un index pour améliorer les performances
CREATE INDEX idx_mcard_quotes_mcard_id ON public.mcard_quotes(mcard_id);
CREATE INDEX idx_mcard_quote_items_quote_id ON public.mcard_quote_items(quote_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_mcard_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mcard_quotes_updated_at
  BEFORE UPDATE ON public.mcard_quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_mcard_quotes_updated_at();