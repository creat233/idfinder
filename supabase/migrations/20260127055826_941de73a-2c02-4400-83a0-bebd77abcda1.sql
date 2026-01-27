-- =====================================================
-- LOYALTY PROGRAM TABLES
-- =====================================================

-- Table pour les paramètres du programme de fidélité par MCard
CREATE TABLE public.mcard_loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  points_per_purchase INTEGER NOT NULL DEFAULT 10,
  points_per_favorite INTEGER NOT NULL DEFAULT 5,
  points_per_message INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(mcard_id)
);

-- Table pour les points de fidélité des clients
CREATE TABLE public.mcard_loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(mcard_id, customer_id)
);

-- Table pour les récompenses disponibles
CREATE TABLE public.mcard_loyalty_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  reward_type TEXT NOT NULL DEFAULT 'discount',
  reward_value NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_redemptions INTEGER,
  current_redemptions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les échanges de récompenses
CREATE TABLE public.mcard_loyalty_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id UUID NOT NULL REFERENCES public.mcard_loyalty_rewards(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL,
  points_spent INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  validated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour l'historique des points
CREATE TABLE public.mcard_loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- MARKETING QUOTA & PACKS TABLES
-- =====================================================

-- Table pour les quotas marketing hebdomadaires
CREATE TABLE public.mcard_marketing_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  free_messages_used INTEGER NOT NULL DEFAULT 0,
  paid_messages_used INTEGER NOT NULL DEFAULT 0,
  paid_messages_available INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(mcard_id, week_start)
);

-- Table pour les packs de messages achetés
CREATE TABLE public.mcard_marketing_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  pack_size INTEGER NOT NULL,
  price_fcfa INTEGER NOT NULL,
  messages_remaining INTEGER NOT NULL,
  stripe_payment_id TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.mcard_loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcard_loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcard_loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcard_loyalty_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcard_loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcard_marketing_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcard_marketing_packs ENABLE ROW LEVEL SECURITY;

-- Loyalty Programs policies
CREATE POLICY "Owners can manage their loyalty programs"
ON public.mcard_loyalty_programs FOR ALL
USING (EXISTS (SELECT 1 FROM mcards WHERE mcards.id = mcard_loyalty_programs.mcard_id AND mcards.user_id = auth.uid()));

CREATE POLICY "Public can view active loyalty programs"
ON public.mcard_loyalty_programs FOR SELECT
USING (is_active = true AND EXISTS (SELECT 1 FROM mcards WHERE mcards.id = mcard_loyalty_programs.mcard_id AND mcards.is_published = true));

-- Loyalty Points policies
CREATE POLICY "Owners can view their customers points"
ON public.mcard_loyalty_points FOR SELECT
USING (EXISTS (SELECT 1 FROM mcards WHERE mcards.id = mcard_loyalty_points.mcard_id AND mcards.user_id = auth.uid()));

CREATE POLICY "Customers can view their own points"
ON public.mcard_loyalty_points FOR SELECT
USING (customer_id = auth.uid());

-- Loyalty Rewards policies
CREATE POLICY "Owners can manage their rewards"
ON public.mcard_loyalty_rewards FOR ALL
USING (EXISTS (SELECT 1 FROM mcards WHERE mcards.id = mcard_loyalty_rewards.mcard_id AND mcards.user_id = auth.uid()));

CREATE POLICY "Public can view active rewards"
ON public.mcard_loyalty_rewards FOR SELECT
USING (is_active = true AND EXISTS (SELECT 1 FROM mcards WHERE mcards.id = mcard_loyalty_rewards.mcard_id AND mcards.is_published = true));

-- Loyalty Redemptions policies
CREATE POLICY "Owners can manage redemptions"
ON public.mcard_loyalty_redemptions FOR ALL
USING (EXISTS (
  SELECT 1 FROM mcard_loyalty_rewards r
  JOIN mcards m ON m.id = r.mcard_id
  WHERE r.id = mcard_loyalty_redemptions.reward_id AND m.user_id = auth.uid()
));

CREATE POLICY "Customers can view and create their redemptions"
ON public.mcard_loyalty_redemptions FOR SELECT
USING (customer_id = auth.uid());

CREATE POLICY "Customers can redeem rewards"
ON public.mcard_loyalty_redemptions FOR INSERT
WITH CHECK (customer_id = auth.uid());

-- Loyalty Transactions policies
CREATE POLICY "Owners can view transactions"
ON public.mcard_loyalty_transactions FOR SELECT
USING (EXISTS (SELECT 1 FROM mcards WHERE mcards.id = mcard_loyalty_transactions.mcard_id AND mcards.user_id = auth.uid()));

CREATE POLICY "Customers can view their transactions"
ON public.mcard_loyalty_transactions FOR SELECT
USING (customer_id = auth.uid());

-- Marketing Quotas policies
CREATE POLICY "Owners can manage their quotas"
ON public.mcard_marketing_quotas FOR ALL
USING (EXISTS (SELECT 1 FROM mcards WHERE mcards.id = mcard_marketing_quotas.mcard_id AND mcards.user_id = auth.uid()));

-- Marketing Packs policies
CREATE POLICY "Owners can manage their packs"
ON public.mcard_marketing_packs FOR ALL
USING (EXISTS (SELECT 1 FROM mcards WHERE mcards.id = mcard_marketing_packs.mcard_id AND mcards.user_id = auth.uid()));

-- =====================================================
-- Add expires_at to marketing messages
-- =====================================================
ALTER TABLE public.mcard_messages ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.mcard_messages ADD COLUMN IF NOT EXISTS is_marketing BOOLEAN DEFAULT false;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to get current week start (Monday)
CREATE OR REPLACE FUNCTION public.get_week_start(input_date DATE DEFAULT CURRENT_DATE)
RETURNS DATE
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT date_trunc('week', input_date)::DATE;
$$;

-- Function to get or create weekly quota
CREATE OR REPLACE FUNCTION public.get_or_create_marketing_quota(p_mcard_id UUID)
RETURNS public.mcard_marketing_quotas
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_week_start DATE;
  v_quota mcard_marketing_quotas;
BEGIN
  v_week_start := get_week_start();
  
  SELECT * INTO v_quota
  FROM mcard_marketing_quotas
  WHERE mcard_id = p_mcard_id AND week_start = v_week_start;
  
  IF NOT FOUND THEN
    INSERT INTO mcard_marketing_quotas (mcard_id, week_start)
    VALUES (p_mcard_id, v_week_start)
    RETURNING * INTO v_quota;
  END IF;
  
  RETURN v_quota;
END;
$$;

-- Function to check available messages
CREATE OR REPLACE FUNCTION public.get_available_marketing_messages(p_mcard_id UUID)
RETURNS TABLE(
  free_remaining INTEGER,
  paid_remaining INTEGER,
  total_remaining INTEGER,
  can_send BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_quota mcard_marketing_quotas;
  v_free_limit INTEGER := 20;
  v_free_remaining INTEGER;
  v_paid_remaining INTEGER;
BEGIN
  v_quota := get_or_create_marketing_quota(p_mcard_id);
  
  v_free_remaining := GREATEST(0, v_free_limit - v_quota.free_messages_used);
  v_paid_remaining := v_quota.paid_messages_available - v_quota.paid_messages_used;
  
  RETURN QUERY SELECT 
    v_free_remaining,
    v_paid_remaining,
    v_free_remaining + v_paid_remaining,
    (v_free_remaining + v_paid_remaining) > 0;
END;
$$;

-- Function to auto-delete expired marketing messages
CREATE OR REPLACE FUNCTION public.cleanup_expired_marketing_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM mcard_messages
  WHERE is_marketing = true AND expires_at < now();
END;
$$;