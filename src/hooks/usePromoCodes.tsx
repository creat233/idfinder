
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";

export const usePromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const now = new Date();
      const processedCodes = (data || []).map(code => {
        const expiresAt = new Date(code.expires_at);
        const isExpired = expiresAt < now;
        return {
          ...code,
          isExpired,
          daysUntilExpiration: Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        };
      });
      
      setPromoCodes(processedCodes);
    } catch (error: any) {
      console.error("Erreur fetchPromoCodes:", error);
      showError("Erreur", "Impossible de récupérer les codes promo");
    } finally {
      setLoading(false);
    }
  };

  const validatePromoCode = async (code: string) => {
    try {
      const { data: validation, error } = await supabase
        .rpc('validate_promo_code_secure', { 
          code_to_validate: code.toUpperCase().trim() 
        });

      if (error) throw error;

      if (!validation || validation.length === 0 || !validation[0].is_valid) {
        return null;
      }

      const validationResult = validation[0];
      return {
        id: code,
        code: code,
        user_id: validationResult.user_id,
        discount_amount: validationResult.discount_amount,
        is_active: true,
        is_paid: true,
        is_valid: validationResult.is_valid
      };
    } catch (error) {
      console.error("Erreur validatePromoCode:", error);
      return null;
    }
  };

  const createPromoCode = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Utilisateur non connecté");

      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_promo_code');

      if (codeError) throw codeError;

      // Code is now FREE - created as active and paid directly
      const { data, error } = await supabase
        .from("promo_codes")
        .insert({
          user_id: user.id,
          code: codeData,
          is_active: true,
          is_paid: true
        })
        .select()
        .single();

      if (error) throw error;

      showSuccess("Code promo créé !", `Votre code ${data.code} est actif. Partagez-le pour gagner 1000 FCFA par utilisation.`);
      
      await fetchPromoCodes();
      return data;
    } catch (error: any) {
      console.error("Erreur createPromoCode:", error);
      showError("Erreur", error.message || "Impossible de créer le code promo");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  return {
    promoCodes,
    loading,
    fetchPromoCodes,
    createPromoCode,
    validatePromoCode
  };
};
