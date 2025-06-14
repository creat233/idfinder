import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";

// Helper pour obtenir l'admin courant (par défaut récupère l'ID s'il est loggé)
const getCurrentAdminId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user ? user.id : null;
};

export const useAdminPromoPayments = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  // Paiement de récupération validé par l'admin
  const confirmRecoveryPayment = async (recoveryData: {
    cardId: string;
    ownerName: string;
    ownerPhone: string;
    reporterId: string;
    reporterName: string;
    finalPrice: number;
    promoUsageId?: string; // <- très important ici
    promoCodeOwnerId?: string;
    promoCode?: string;
  }) => {
    try {
      setLoading(true);
      console.log("Confirmation du paiement de récupération:", recoveryData);

      // 1. Mettre à jour le statut de la carte comme récupérée
      const { data: updatedRows, error: cardUpdateError } = await supabase
        .from("reported_cards")
        .update({ 
          status: "recovered",
          description: (
            (await supabase
              .from("reported_cards")
              .select("description")
              .eq("id", recoveryData.cardId)
              .single()
            ).data?.description ?? ""
          ) + `\n\n--- PAIEMENT CONFIRMÉ ---\nDate de confirmation: ${new Date().toLocaleString('fr-FR')}\nStatut: PAYÉ ET RÉCUPÉRÉ`
        })
        .eq("id", recoveryData.cardId)
        .select(); // <-- On veut le row retourné

      if (cardUpdateError) {
        console.error("Erreur mise à jour carte:", cardUpdateError);
        throw cardUpdateError;
      }
      if (!updatedRows || updatedRows.length === 0) {
        console.error("Aucune carte mise à jour, id inexistant?");
      } else {
        // Log pour diagnostique
        console.log("Carte après update:", updatedRows[0]);
      }

      // 2. Notification au propriétaire (N.B. : reporterId = id signaleur)
      const { error: ownerNotificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: recoveryData.reporterId,
          type: "recovery_payment_confirmed",
          title: "💰 Paiement confirmé - Récupération de carte",
          message: `Le paiement de ${recoveryData.finalPrice} FCFA pour la récupération de votre carte a été confirmé par l'administration. Vous pouvez maintenant récupérer votre carte.`,
          is_read: false
        });

      if (ownerNotificationError) {
        console.error("Erreur notification propriétaire:", ownerNotificationError);
      }

      // 3. Notification au signaleur (récompense)
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

      // 4. Si un code promo a été utilisé, notifier le propriétaire SEULEMENT à la confirmation ET MAJ la promo_usage
      if (recoveryData.promoUsageId && recoveryData.promoCodeOwnerId && recoveryData.promoCode) {
        // Get admin who validates
        const adminId = await getCurrentAdminId();

        // Marquer l'utilisation comme payée
        const { error: updatePromoError } = await supabase
          .from("promo_usage")
          .update({ 
            is_paid: true,
            paid_at: new Date().toISOString(),
            admin_confirmed_by: adminId ?? null
          })
          .eq("id", recoveryData.promoUsageId);

        if (updatePromoError) {
          console.error("Erreur mise à jour promo usage:", updatePromoError);
        } else {
          // Envoyer la notification de revenu SEULEMENT lors de la confirmation
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
        }
      }

      showSuccess(
        "Paiement confirmé", 
        `Toutes les notifications ont été envoyées et les paiements confirmés (Propriétaire: ${recoveryData.finalPrice} FCFA, Signaleur: 2000 FCFA${recoveryData.promoCode ? `, Propriétaire code promo: 1000 FCFA` : ''})`
      );

      // Ajout : petit délai avant reload pour laisser temps réel se propager
      setTimeout(() => {
        if (window && window.location && typeof window.location.reload === "function") {
          // Ne pas faire reload en prod, mais log la demande de refresh (le hook le gère déjà)
          console.log("Demande de refresh (hook/list) après paiement confirmé.");
        }
      }, 700);

      return true;
    } catch (error) {
      console.error("Erreur lors de la confirmation du paiement:", error);
      showError("Erreur", "Impossible de confirmer le paiement");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Methode legacy, inchangée
  const confirmPromoPayment = async (promoUsageId: string, promoCodeOwnerId: string, amount: number) => {
    try {
      setLoading(true);
      console.log("Confirmation du paiement pour:", { promoUsageId, promoCodeOwnerId, amount });

      // SET PAID!
      const adminId = await getCurrentAdminId();

      const { error: updateError } = await supabase
        .from("promo_usage")
        .update({ 
          is_paid: true,
          paid_at: new Date().toISOString(),
          admin_confirmed_by: adminId ?? null
        })
        .eq("id", promoUsageId);

      if (updateError) {
        console.error("Erreur lors de la mise à jour de l'utilisation:", updateError);
        throw updateError;
      }

      // Ensuite, la notification
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
          message: `Votre code promo ${promoCode} vient d'être utilisé ! Attendez la confirmation de récupération pour recevoir votre revenu de 1000 FCFA.`,
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
