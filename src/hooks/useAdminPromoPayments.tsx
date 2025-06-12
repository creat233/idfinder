
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";

export const useAdminPromoPayments = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const confirmPromoPayment = async (promoUsageId: string, promoCodeOwnerId: string, amount: number) => {
    try {
      setLoading(true);
      console.log("Confirmation du paiement pour:", { promoUsageId, promoCodeOwnerId, amount });

      // Créer une notification permanente pour le propriétaire du code promo
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: promoCodeOwnerId,
          type: "promo_payment_received",
          title: "💰 Paiement reçu - Code promo",
          message: `Félicitations ! Vous avez reçu un paiement de ${amount} FCFA pour l'utilisation de votre code promo. Le paiement a été confirmé par l'administration.`,
          is_read: false
        });

      if (notificationError) {
        console.error("Erreur lors de la création de la notification:", notificationError);
        throw notificationError;
      }

      // Marquer l'utilisation du code promo comme payée (on peut ajouter un champ paid à la table promo_usage)
      const { error: updateError } = await supabase
        .from("promo_usage")
        .update({ 
          // Note: Il faudra ajouter ce champ à la table promo_usage
          // paid_confirmed: true,
          // paid_at: new Date().toISOString()
        })
        .eq("id", promoUsageId);

      showSuccess("Paiement confirmé", "Le propriétaire du code promo a été notifié du paiement");
    } catch (error) {
      console.error("Erreur lors de la confirmation du paiement:", error);
      showError("Erreur", "Impossible de confirmer le paiement");
    } finally {
      setLoading(false);
    }
  };

  const notifyPromoOwner = async (promoCodeId: string, promoOwnerId: string, promoCode: string) => {
    try {
      console.log("Notification du propriétaire du code promo:", { promoCodeId, promoOwnerId, promoCode });

      // Créer une notification pour informer que le code a été utilisé
      const { error } = await supabase
        .from("notifications")
        .insert({
          user_id: promoOwnerId,
          type: "promo_code_used",
          title: "🎉 Code promo utilisé !",
          message: `Votre code promo ${promoCode} vient d'être utilisé ! Attendez la confirmation de récupération pour recevoir votre revenu de 1000 FCFA.`,
          is_read: false
        });

      if (error) {
        console.error("Erreur lors de la notification:", error);
        throw error;
      }

      console.log("Notification envoyée avec succès au propriétaire du code promo");
    } catch (error) {
      console.error("Erreur lors de la notification du propriétaire:", error);
    }
  };

  return {
    confirmPromoPayment,
    notifyPromoOwner,
    loading
  };
};
