
-- Table for expense tracking
CREATE TABLE public.mcard_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'autre',
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mcard_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own expenses"
ON public.mcard_expenses FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.mcards WHERE mcards.id = mcard_expenses.mcard_id AND mcards.user_id = auth.uid())
);

-- Add stock_quantity column to mcard_products
ALTER TABLE public.mcard_products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT NULL;
ALTER TABLE public.mcard_products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;

-- Table for push notification subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own subscriptions"
ON public.push_subscriptions FOR ALL
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_mcard_expenses_updated_at
BEFORE UPDATE ON public.mcard_expenses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_push_subscriptions_updated_at
BEFORE UPDATE ON public.push_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
