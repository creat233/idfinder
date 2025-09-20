
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
      console.log("Récupération des codes promo...");
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("Utilisateur non connecté");
        return;
      }

      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des codes promo:", error);
        throw error;
      }

      console.log("Codes promo récupérés:", data?.length || 0);
      
      // Vérifier et marquer les codes expirés côté client
      const now = new Date();
      const processedCodes = (data || []).map(code => {
        const expiresAt = new Date(code.expires_at);
        const isExpired = expiresAt < now;
        
        if (isExpired && code.is_active) {
          console.warn(`⏰ Code ${code.code} expiré le ${expiresAt.toLocaleDateString()}`);
        }
        
        return {
          ...code,
          isExpired, // Ajouter un flag pour l'UI
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
      console.log("🔍 Validation sécurisée du code promo:", code);
      
      // Utiliser la fonction sécurisée de validation
      const { data: validation, error } = await supabase
        .rpc('validate_promo_code_secure', { 
          code_to_validate: code.toUpperCase().trim() 
        });

      if (error) {
        console.error("❌ Erreur lors de la validation:", error);
        throw error;
      }

      if (!validation || validation.length === 0 || !validation[0].is_valid) {
        console.log("❌ Code promo non trouvé, inactif ou expiré:", code);
        return null;
      }

      const validationResult = validation[0];
      console.log("✅ Code promo validé avec succès:", {
        code: code,
        is_valid: validationResult.is_valid,
        discount_amount: validationResult.discount_amount,
        user_id: validationResult.user_id
      });
      
      // Retourner un objet compatible avec l'ancienne structure
      return {
        id: code, // On utilise le code comme identifiant temporaire
        code: code,
        user_id: validationResult.user_id,
        discount_amount: validationResult.discount_amount,
        is_active: true,
        is_paid: true,
        is_valid: validationResult.is_valid
      };
    } catch (error) {
      console.error("❌ Erreur validatePromoCode:", error);
      return null;
    }
  };

  const createPromoCode = async () => {
    try {
      setLoading(true);
      console.log("Création d'un nouveau code promo...");
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      // Générer un code promo
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_promo_code');

      if (codeError) {
        console.error("Erreur génération code:", codeError);
        throw codeError;
      }

      console.log("Code généré:", codeData);

      // Insérer le code promo
      const { data, error } = await supabase
        .from("promo_codes")
        .insert({
          user_id: user.id,
          code: codeData,
          is_active: false,
          is_paid: false
        })
        .select()
        .single();

      if (error) {
        console.error("Erreur insertion code promo:", error);
        throw error;
      }

      console.log("Code promo créé:", data);
      showSuccess("Code promo créé", `Votre code ${data.code} a été créé. Il sera activé après paiement.`);
      
      // Actualiser la liste
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
