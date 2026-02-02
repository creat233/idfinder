-- Add new columns to loyalty programs for configurable one-time actions
ALTER TABLE public.mcard_loyalty_programs 
ADD COLUMN IF NOT EXISTS points_per_like integer NOT NULL DEFAULT 5,
ADD COLUMN IF NOT EXISTS points_per_share integer NOT NULL DEFAULT 10,
ADD COLUMN IF NOT EXISTS points_per_review integer NOT NULL DEFAULT 20,
ADD COLUMN IF NOT EXISTS points_per_product_like integer NOT NULL DEFAULT 3,
ADD COLUMN IF NOT EXISTS points_per_save integer NOT NULL DEFAULT 5;

-- Create table to track completed loyalty actions (one-time actions)
CREATE TABLE IF NOT EXISTS public.mcard_loyalty_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mcard_id uuid NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL,
  action_type text NOT NULL, -- 'favorite', 'like', 'share', 'review', 'product_like', 'save'
  product_id uuid REFERENCES public.mcard_products(id) ON DELETE CASCADE, -- For product likes
  points_earned integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(mcard_id, customer_id, action_type, product_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_loyalty_actions_mcard_customer ON public.mcard_loyalty_actions(mcard_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_actions_action_type ON public.mcard_loyalty_actions(action_type);

-- Enable RLS
ALTER TABLE public.mcard_loyalty_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Customers can view their own actions"
ON public.mcard_loyalty_actions
FOR SELECT
USING (customer_id = auth.uid());

CREATE POLICY "Customers can insert their own actions"
ON public.mcard_loyalty_actions
FOR INSERT
WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Owners can view actions on their mcards"
ON public.mcard_loyalty_actions
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM mcards WHERE mcards.id = mcard_loyalty_actions.mcard_id AND mcards.user_id = auth.uid()
));

-- Function to award points for a loyalty action
CREATE OR REPLACE FUNCTION public.award_loyalty_points(
  p_mcard_id uuid,
  p_customer_id uuid,
  p_action_type text,
  p_product_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_program mcard_loyalty_programs%ROWTYPE;
  v_points integer := 0;
  v_existing_action uuid;
  v_action_id uuid;
BEGIN
  -- Check if program exists and is active
  SELECT * INTO v_program 
  FROM mcard_loyalty_programs 
  WHERE mcard_id = p_mcard_id AND is_active = true;
  
  IF v_program.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Programme de fidélité non actif');
  END IF;
  
  -- Check if action already completed (for one-time actions)
  SELECT id INTO v_existing_action
  FROM mcard_loyalty_actions
  WHERE mcard_id = p_mcard_id 
    AND customer_id = p_customer_id 
    AND action_type = p_action_type
    AND (p_product_id IS NULL OR product_id = p_product_id);
  
  IF v_existing_action IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Action déjà effectuée', 'already_done', true);
  END IF;
  
  -- Calculate points based on action type
  CASE p_action_type
    WHEN 'favorite' THEN v_points := v_program.points_per_favorite;
    WHEN 'like' THEN v_points := v_program.points_per_like;
    WHEN 'share' THEN v_points := v_program.points_per_share;
    WHEN 'review' THEN v_points := v_program.points_per_review;
    WHEN 'product_like' THEN v_points := v_program.points_per_product_like;
    WHEN 'save' THEN v_points := v_program.points_per_save;
    WHEN 'message' THEN v_points := v_program.points_per_message;
    ELSE v_points := 0;
  END CASE;
  
  IF v_points = 0 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Action non récompensée');
  END IF;
  
  -- Record the action
  INSERT INTO mcard_loyalty_actions (mcard_id, customer_id, action_type, product_id, points_earned)
  VALUES (p_mcard_id, p_customer_id, p_action_type, p_product_id, v_points)
  RETURNING id INTO v_action_id;
  
  -- Update or create loyalty points record
  INSERT INTO mcard_loyalty_points (mcard_id, customer_id, total_points, lifetime_points)
  VALUES (p_mcard_id, p_customer_id, v_points, v_points)
  ON CONFLICT (mcard_id, customer_id) 
  DO UPDATE SET 
    total_points = mcard_loyalty_points.total_points + v_points,
    lifetime_points = mcard_loyalty_points.lifetime_points + v_points,
    updated_at = now();
  
  -- Record transaction
  INSERT INTO mcard_loyalty_transactions (mcard_id, customer_id, points, transaction_type, description)
  VALUES (p_mcard_id, p_customer_id, v_points, 'earn', 'Points gagnés: ' || p_action_type);
  
  RETURN jsonb_build_object(
    'success', true, 
    'points_earned', v_points, 
    'action_type', p_action_type,
    'message', 'Vous avez gagné ' || v_points || ' points!'
  );
END;
$$;

-- Add unique constraint for mcard_loyalty_points if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'mcard_loyalty_points_mcard_customer_unique'
  ) THEN
    ALTER TABLE mcard_loyalty_points ADD CONSTRAINT mcard_loyalty_points_mcard_customer_unique UNIQUE (mcard_id, customer_id);
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;