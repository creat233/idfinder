
CREATE POLICY "Public can view active ads"
  ON public.admin_ads
  FOR SELECT
  TO public
  USING (
    is_active = true AND
    (start_date IS NULL OR start_date <= CURRENT_DATE) AND
    (end_date IS NULL OR end_date >= CURRENT_DATE)
  );
