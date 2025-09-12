-- Fix security vulnerability: Restrict access to reported_cards table
-- Remove the overly permissive policy that allows anyone to view reported cards
DROP POLICY IF EXISTS "Anyone can view reported cards" ON public.reported_cards;

-- Create secure policies that only allow appropriate access
-- 1. Reporters can view cards they reported
CREATE POLICY "Reporters can view their own reported cards" 
ON public.reported_cards 
FOR SELECT 
USING (auth.uid() = reporter_id);

-- 2. Card owners can view their own cards that were reported
CREATE POLICY "Card owners can view their reported cards" 
ON public.reported_cards 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_cards uc
    WHERE uc.card_number = reported_cards.card_number 
    AND uc.user_id = auth.uid()
    AND uc.is_active = true
  )
);

-- 3. Admins can view all reported cards for management purposes
CREATE POLICY "Admins can view all reported cards" 
ON public.reported_cards 
FOR SELECT 
USING (public.is_admin());

-- Keep existing policies for other operations (they are already secure)
-- INSERT: "Authenticated users can insert reported cards" - already secure
-- UPDATE: "Users can update their own reported cards" and "Admins can update any card" - already secure