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
    promoCodeId?: string;
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
        .select();

      if (cardUpdateError) {
        console.error("Erreur mise à jour carte:", cardUpdateError);
        throw cardUpdateError;
      }
      if (!updatedRows || updatedRows.length === 0) {
        console.error("Aucune carte mise à jour, id inexistant?");
      } else {
        console.log("Carte après update:", updatedRows[0]);
      }

      // --- Logique améliorée pour notifier le propriétaire de la carte ---
      const { data: cardDetails } = await supabase
        .from("reported_cards")
        .select("card_number")
        .eq("id", recoveryData.cardId)
        .single();
      
      if (cardDetails && cardDetails.card_number) {
        const { data: cardOwner } = await supabase
          .from("user_cards")
          .select("user_id")
          .eq("card_number", cardDetails.card_number)
          .single();

        // 2. Notification au propriétaire de la carte (si trouvé)
        if (cardOwner && cardOwner.user_id) {
          const { error: ownerNotificationError } = await supabase
            .from("notifications")
            .insert({
              user_id: cardOwner.user_id, // ID correct du propriétaire
              type: "recovery_payment_confirmed",
              title: "💰 Paiement confirmé - Carte récupérée",
              message: `La procédure de récupération pour votre carte n. ${cardDetails.card_number} a été finalisée avec succès.`,
              is_read: false,
              reported_card_id: recoveryData.cardId,
            });

          if (ownerNotificationError) {
            console.error("Erreur notification propriétaire carte:", ownerNotificationError);
          } else {
            console.log("✅ Notification envoyée au propriétaire de la carte:", cardOwner.user_id);
          }
        }
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

      // 4. Si un code promo a été utilisé, créer l'usage, mettre à jour les gains et notifier
      if (recoveryData.promoCodeId && recoveryData.promoCodeOwnerId && recoveryData.promoCode) {
        const adminId = await getCurrentAdminId();

        // A. Créer l'enregistrement promo_usage avec is_paid: false pour que le trigger d'UPDATE fonctionne
        const { data: usage, error: usageError } = await supabase
          .from("promo_usage")
          .insert({
            promo_code_id: recoveryData.promoCodeId,
            used_by_phone: recoveryData.ownerPhone,
            discount_amount: 1000,
            is_paid: false, // On insère en non-payé pour déclencher le trigger sur l'update
            reported_card_id: recoveryData.cardId,
          })
          .select('id')
          .single();

        if (usageError || !usage) {
          console.error("Erreur lors de la création de l'utilisation du promo:", usageError);
        } else {
           // B. Mettre à jour immédiatement pour déclencher le trigger qui calcule les gains
           const { error: earningsError } = await supabase.from('promo_usage').update({
                  is_paid: true,
                  paid_at: new Date().toISOString(),
                  admin_confirmed_by: adminId ?? null
              }).eq('id', usage.id);
           
           if(earningsError) {
              console.error("Erreur lors de la mise à jour de promo_usage pour les gains:", earningsError);
           }
          
          // C. La notification de revenu est maintenant gérée par le trigger 'on_promo_payment_processed' dans la base de données.
          //    Aucune insertion manuelle n'est nécessaire ici pour éviter les doublons.
          console.log("✅ Paiement du code promo enregistré. Le trigger s'occupera de la notification.");
        }
      }

      showSuccess(
        "Paiement confirmé", 
        `Toutes les notifications ont été envoyées et les paiements confirmés (Propriétaire: ${recoveryData.finalPrice} FCFA, Signaleur: 2000 FCFA${recoveryData.promoCode ? `, Propriétaire code promo: 1000 FCFA` : ''})`
      );

      console.log("Demande de refresh (hook/list) après paiement confirmé.");

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
