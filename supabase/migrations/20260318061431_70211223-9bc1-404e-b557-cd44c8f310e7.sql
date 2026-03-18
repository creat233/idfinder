CREATE POLICY "Admin full access marketing packs"
ON public.mcard_marketing_packs
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());