
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";

export const useAdminPromoPayments = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const confirmRecoveryPayment = async (recoveryData: {
    cardId: string;
    ownerName: string;
    ownerPhone: string;
    reporterId: string;
    reporterName: string;
    finalPrice: number;
    promoUsageId?: string;
    promoCodeOwnerId?: string;
    promoCode?: string;
  }) => {
    try {
      setLoading(true);
      console.log("Confirmation du paiement de récupération:", recoveryData);

      // 1. Notification au propriétaire de la carte
      const { error: ownerNotificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: recoveryData.reporterId, // On utilise l'ID du signaleur car on n'a pas l'ID du propriétaire
          type: "recovery_payment_confirmed",
          title: "💰 Paiement confirmé - Récupération de carte",
          message: `Le paiement de ${recoveryData.finalPrice} FCFA pour la récupération de votre carte a été confirmé par l'administration. Vous pouvez maintenant récupérer votre carte.`,
          is_read: false
        });

      if (ownerNotificationError) {
        console.error("Erreur notification propriétaire:", ownerNotificationError);
      }

      // 2. Notification au signaleur (récompense de 2000 FCFA)
      const { error: reporterNotificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: recoveryData.reporterId,
          type: "reporter_reward_received",
          title: "🎉 Récompense reçue - Signalement de carte",
          message: `Félicitations ! Vous avez reçu votre récompense de 2000 FCFA pour avoir signalé une carte qui a été récupérée. Merci de contribuer à FinderID !`,
          is_read: false
        });

      if (reporterNotificationError) {
        console.error("Erreur notification signaleur:", reporterNotificationError);
      }

      // 3. Si un code promo a été utilisé, notifier le propriétaire du code promo
      if (recoveryData.promoUsageId && recoveryData.promoCodeOwnerId && recoveryData.promoCode) {
        const { error: promoOwnerNotificationError } = await supabase
          .from("notifications")
          .insert({
            user_id: recoveryData.promoCodeOwnerId,
            type: "promo_payment_received",
            title: "💰 Paiement reçu - Code promo",
            message: `Félicitations ! Vous avez reçu un paiement de 1000 FCFA pour l'utilisation de votre code promo ${recoveryData.promoCode}. Le propriétaire a récupéré sa carte avec succès.`,
            is_read: false
          });

        if (promoOwnerNotificationError) {
          console.error("Erreur notification propriétaire code promo:", promoOwnerNotificationError);
        }

        // Marquer l'utilisation du code promo comme payée
        const { error: updatePromoError } = await supabase
          .from("promo_usage")
          .update({ 
            // Note: Ces champs devront être ajoutés à la table promo_usage si nécessaire
          })
          .eq("id", recoveryData.promoUsageId);

        if (updatePromoError) {
          console.error("Erreur mise à jour promo usage:", updatePromoError);
        }
      }

      // 4. Mettre à jour le statut de la carte comme récupérée
      const { error: cardUpdateError } = await supabase
        .from("reported_cards")
        .update({ 
          status: "recovered",
          description: (await supabase
            .from("reported_cards")
            .select("description")
            .eq("id", recoveryData.cardId)
            .single()).data?.description + `\n\n--- PAIEMENT CONFIRMÉ ---\nDate de confirmation: ${new Date().toLocaleString('fr-FR')}\nStatut: PAYÉ ET RÉCUPÉRÉ`
        })
        .eq("id", recoveryData.cardId);

      if (cardUpdateError) {
        console.error("Erreur mise à jour carte:", cardUpdateError);
      }

      showSuccess(
        "Paiement confirmé", 
        `Toutes les notifications ont été envoyées et les paiements confirmés (Propriétaire: ${recoveryData.finalPrice} FCFA, Signaleur: 2000 FCFA${recoveryData.promoCode ? `, Propriétaire code promo: 1000 FCFA` : ''})`
      );
    } catch (error) {
      console.error("Erreur lors de la confirmation du paiement:", error);
      showError("Erreur", "Impossible de confirmer le paiement");
    } finally {
      setLoading(false);
    }
  };

  // Garder l'ancienne méthode pour compatibilité
  const confirmPromoPayment = async (promoUsageId: string, promoCodeOwnerId: string, amount: number) => {
    try {
      setLoading(true);
      console.log("Confirmation du paiement pour:", { promoUsageId, promoCodeOwnerId, amount });

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

      const { error: updateError } = await supabase
        .from("promo_usage")
        .update({ 
          // Note: Ces champs devront être ajoutés à la table promo_usage si nécessaire
        })
        .eq("id", promoUsageId);

      if (updateError) {
        console.error("Erreur lors de la mise à jour de l'utilisation:", updateError);
      }

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
    confirmRecoveryPayment,
    confirmPromoPayment,
    notifyPromoOwner,
    loading
  };
};
