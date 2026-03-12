
CREATE TABLE public.mcard_pack_purchase_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mcard_id uuid REFERENCES public.mcards(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  pack_size integer NOT NULL,
  price_fcfa integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  processed_by text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.mcard_pack_purchase_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pack requests" ON public.mcard_pack_purchase_requests
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create pack requests" ON public.mcard_pack_purchase_requests
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin full access pack requests" ON public.mcard_pack_purchase_requests
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_permissions WHERE user_email = (SELECT email FROM auth.users WHERE id = auth.uid()) AND is_active = true)
  );
