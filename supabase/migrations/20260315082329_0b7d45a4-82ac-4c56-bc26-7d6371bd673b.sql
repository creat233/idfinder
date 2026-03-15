
-- Fix admin policy to use is_admin() function instead of direct auth.users access
DROP POLICY IF EXISTS "Admin full access pack requests" ON public.mcard_pack_purchase_requests;

CREATE POLICY "Admin full access pack requests"
ON public.mcard_pack_purchase_requests
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
