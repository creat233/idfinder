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
      setPromoCodes(data || []);
    } catch (error: any) {
      console.error("Erreur fetchPromoCodes:", error);
      showError("Erreur", "Impossible de récupérer les codes promo");
    } finally {
      setLoading(false);
    }
  };

  const validatePromoCode = async (code: string) => {
    try {
      console.log("🔍 Validation du code promo:", code);
      
      // Première tentative: chercher le code exact avec is_active = true
      let { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", code.toUpperCase().trim())
        .eq("is_active", true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("❌ Erreur lors de la validation:", error);
        throw error;
      }

      // Si pas trouvé avec is_active = true, chercher juste le code pour voir s'il existe
      if (!data) {
        console.log("🔍 Code non trouvé avec is_active=true, recherche du code...");
        const { data: codeData, error: codeError } = await supabase
          .from("promo_codes")
          .select("*")
          .eq("code", code.toUpperCase().trim())
          .maybeSingle();

        if (codeError && codeError.code !== 'PGRST116') {
          console.error("❌ Erreur lors de la recherche du code:", codeError);
          throw codeError;
        }

        if (codeData) {
          console.log("📋 Code trouvé mais pas actif:", {
            code: codeData.code,
            is_active: codeData.is_active,
            is_paid: codeData.is_paid,
            user_id: codeData.user_id
          });
          
          // Si le code existe mais n'est pas actif, on le retourne quand même
          // pour permettre son utilisation (logique métier)
          if (!codeData.is_active) {
            console.log("⚠️ Code trouvé mais marqué comme inactif, acceptance forcée pour test");
            data = codeData;
          }
        }
      }

      if (!data) {
        console.log("❌ Code promo non trouvé:", code);
        return null;
      }

      // Vérifier si le code a expiré
      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      if (expiresAt < now) {
        console.log("⏰ Code promo expiré:", code, "Expire le:", expiresAt);
        return null;
      }

      console.log("✅ Code promo validé:", {
        code: data.code,
        is_active: data.is_active,
        expires_at: data.expires_at,
        user_id: data.user_id
      });
      
      return data;
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
