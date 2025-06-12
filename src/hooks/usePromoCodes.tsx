import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";

interface PromoCode {
  id: string;
  code: string;
  is_active: boolean;
  is_paid: boolean;
  created_at: string;
  expires_at: string;
  total_earnings: number;
  usage_count: number;
}

export const usePromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const fetchPromoCodes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      showError("Erreur", "Impossible de récupérer vos codes promo");
    } finally {
      setLoading(false);
    }
  };

  const generatePromoCode = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Récupérer le profil de l'utilisateur pour les informations personnelles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Erreur lors de la récupération du profil:", profileError);
      }

      // Générer le code via la fonction RPC
      const { data: generatedCode, error: codeError } = await supabase
        .rpc('generate_promo_code');

      if (codeError) throw codeError;

      // Créer l'entrée dans la table promo_codes
      const { error } = await supabase.from("promo_codes").insert({
        user_id: user.id,
        code: generatedCode,
      });

      if (error) throw error;

      // Envoyer les notifications WhatsApp
      try {
        const userName = profile 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Utilisateur'
          : 'Utilisateur';
        
        const phone = profile?.phone || user.phone || '';

        if (phone) {
          const { error: whatsappError } = await supabase.functions.invoke('send-whatsapp-notification', {
            body: {
              phone: phone,
              message: 'Nouveau code promo généré',
              promoCode: generatedCode,
              userName: userName
            }
          });

          if (whatsappError) {
            console.error("Erreur WhatsApp:", whatsappError);
            // Ne pas faire échouer la génération du code pour une erreur WhatsApp
            showSuccess("Code généré", `Votre code promo ${generatedCode} a été généré avec succès. Notification WhatsApp en cours...`);
          } else {
            showSuccess("Code généré", `Votre code promo ${generatedCode} a été généré avec succès et vous recevrez une notification WhatsApp sous peu.`);
          }
        } else {
          showSuccess("Code généré", `Votre code promo ${generatedCode} a été généré avec succès. Ajoutez votre numéro de téléphone dans votre profil pour recevoir les notifications WhatsApp.`);
        }
      } catch (whatsappError) {
        console.error("Erreur lors de l'envoi WhatsApp:", whatsappError);
        showSuccess("Code généré", `Votre code promo ${generatedCode} a été généré avec succès.`);
      }
      
      fetchPromoCodes();
      return generatedCode;
    } catch (error: any) {
      console.error("Error generating promo code:", error);
      showError("Erreur", "Impossible de générer le code promo");
      return null;
    }
  };

  const validatePromoCode = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", code)
        .eq("is_active", true)
        .gte("expires_at", new Date().toISOString())
        .single();

      if (error || !data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error validating promo code:", error);
      return null;
    }
  };

  const recordPromoUsage = async (promoCodeId: string, userEmail?: string, userPhone?: string) => {
    try {
      const { error } = await supabase.from("promo_usage").insert({
        promo_code_id: promoCodeId,
        used_by_email: userEmail,
        used_by_phone: userPhone,
        discount_amount: 1000,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error recording promo usage:", error);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  return {
    promoCodes,
    loading,
    generatePromoCode,
    validatePromoCode,
    recordPromoUsage,
    refetch: fetchPromoCodes,
  };
};
