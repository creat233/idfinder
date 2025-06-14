
-- Politique existante (rappel) :
-- CREATE POLICY "Users can view their own promo codes" 
--   ON public.promo_codes 
--   FOR SELECT 
--   USING (auth.uid() = user_id);

-- Nouvelle politique : tout utilisateur peut voir/un code promo si le code, l’activation et la validité sont corrects
CREATE POLICY "Everyone can validate a promo code by code if actif, payé et non expiré"
  ON public.promo_codes
  FOR SELECT
  USING (
    is_active = true
    AND is_paid = true
    AND expires_at > now()
    -- Permet uniquement pour la recherche par code explicite : (optionnel, pour restreindre le SELECT !)
    -- Pour plus de sécurité, ajouter : (code = current_setting('request.jwt.claims', true)::json->>'code_promo_check')
  );

-- NB : cela permet à tous les utilisateurs d’appliquer un code promo si le code est actif/valable
