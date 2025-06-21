
import { supabase } from "@/integrations/supabase/client";

export const createMissingCardNotification = async (cardNumber: string) => {
  try {
    console.log("🔍 Recherche de cartes signalées pour le numéro:", cardNumber);
    
    // Trouver la carte signalée
    const { data: reportedCard, error: reportedError } = await supabase
      .from("reported_cards")
      .select("*")
      .eq("card_number", cardNumber)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (reportedError || !reportedCard) {
      console.log("❌ Aucune carte signalée trouvée pour ce numéro");
      return { success: false, message: "Aucune carte signalée trouvée" };
    }

    console.log("✅ Carte signalée trouvée:", reportedCard);

    // Trouver le propriétaire de la carte
    const { data: userCard, error: userCardError } = await supabase
      .from("user_cards")
      .select("*")
      .eq("card_number", cardNumber)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (userCardError || !userCard) {
      console.log("❌ Aucun propriétaire trouvé pour cette carte");
      return { success: false, message: "Aucun propriétaire trouvé" };
    }

    console.log("✅ Propriétaire trouvé:", userCard);

    // Récupérer le profil de l'utilisateur séparément
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, is_on_vacation")
      .eq("id", userCard.user_id)
      .single();

    if (profileError) {
      console.log("⚠️ Profil non trouvé, on continue sans vérification du mode vacances");
    }

    // Vérifier si l'utilisateur est en mode vacances
    if (profile?.is_on_vacation) {
      console.log("⚠️ L'utilisateur est en mode vacances, pas de notification");
      return { success: false, message: "Utilisateur en mode vacances" };
    }

    // Vérifier si une notification existe déjà
    const { data: existingNotification } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", userCard.user_id)
      .eq("reported_card_id", reportedCard.id)
      .eq("type", "card_found")
      .limit(1)
      .single();

    if (existingNotification) {
      console.log("⚠️ Une notification existe déjà pour cette carte");
      return { success: false, message: "Notification déjà existante" };
    }

    // Créer la notification
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: userCard.user_id,
        reported_card_id: reportedCard.id,
        type: "card_found",
        title: "🔍 Votre carte a été signalée !",
        message: `Excellente nouvelle ! Votre carte ${reportedCard.document_type} avec le numéro ${reportedCard.card_number} a été signalée comme trouvée sur FinderID. Recherchez ce numéro dans la barre de recherche pour voir les détails et confirmer la récupération.`,
        is_read: false
      })
      .select()
      .single();

    if (notificationError) {
      console.error("❌ Erreur lors de la création de la notification:", notificationError);
      return { success: false, message: "Erreur lors de la création" };
    }

    console.log("✅ Notification créée avec succès:", notification);
    return { success: true, notification };

  } catch (error) {
    console.error("❌ Erreur générale:", error);
    return { success: false, message: "Erreur générale" };
  }
};

// Fonction pour vérifier et créer automatiquement une notification après signalement
export const checkAndNotifyCardOwner = async (cardNumber: string) => {
  try {
    console.log("🔔 Vérification automatique pour notification du propriétaire de la carte:", cardNumber);
    
    // Chercher si quelqu'un a enregistré cette carte
    const { data: userCard, error: userCardError } = await supabase
      .from("user_cards")
      .select("*")
      .eq("card_number", cardNumber)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (userCardError || !userCard) {
      console.log("ℹ️ Aucun propriétaire enregistré pour cette carte");
      return { success: false, message: "Aucun propriétaire enregistré" };
    }

    // Vérifier le mode vacances
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_on_vacation")
      .eq("id", userCard.user_id)
      .single();

    if (profile?.is_on_vacation) {
      console.log("⚠️ Utilisateur en mode vacances, pas de notification");
      return { success: false, message: "Utilisateur en mode vacances" };
    }

    // Chercher la carte signalée récemment
    const { data: reportedCard, error: reportedError } = await supabase
      .from("reported_cards")
      .select("*")
      .eq("card_number", cardNumber)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (reportedError || !reportedCard) {
      console.log("❌ Carte signalée non trouvée");
      return { success: false, message: "Carte signalée non trouvée" };
    }

    // Vérifier si notification existe déjà
    const { data: existingNotification } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", userCard.user_id)
      .eq("reported_card_id", reportedCard.id)
      .eq("type", "card_found")
      .limit(1)
      .single();

    if (existingNotification) {
      console.log("ℹ️ Notification déjà existante");
      return { success: false, message: "Notification déjà existante" };
    }

    // Créer la notification
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: userCard.user_id,
        reported_card_id: reportedCard.id,
        type: "card_found",
        title: "🔍 Votre carte a été signalée !",
        message: `Excellente nouvelle ! Votre carte ${reportedCard.document_type} avec le numéro ${reportedCard.card_number} a été signalée comme trouvée sur FinderID. Recherchez ce numéro dans la barre de recherche pour voir les détails et confirmer la récupération.`,
        is_read: false
      })
      .select()
      .single();

    if (notificationError) {
      console.error("❌ Erreur création notification:", notificationError);
      return { success: false, message: "Erreur lors de la création" };
    }

    console.log("✅ Notification automatique créée:", notification);
    return { success: true, notification };

  } catch (error) {
    console.error("❌ Erreur vérification automatique:", error);
    return { success: false, message: "Erreur générale" };
  }
};

export const debugCardNotificationSystem = async (cardNumber: string) => {
  try {
    console.log("🔍 Diagnostic du système de notifications pour la carte:", cardNumber);
    
    // Vérifier les cartes utilisateur
    const { data: userCards } = await supabase
      .from("user_cards")
      .select("*")
      .eq("card_number", cardNumber);

    console.log("👤 Cartes utilisateur trouvées:", userCards);

    // Vérifier les profils si des cartes utilisateur existent
    let profilesData = null;
    if (userCards && userCards.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, is_on_vacation, enable_security_notifications")
        .in("id", userCards.map(card => card.user_id));
      
      profilesData = profiles;
    }

    console.log("👤 Profils trouvés:", profilesData);

    // Vérifier les cartes signalées
    const { data: reportedCards } = await supabase
      .from("reported_cards")
      .select("*")
      .eq("card_number", cardNumber);

    console.log("📋 Cartes signalées trouvées:", reportedCards);

    // Vérifier les notifications existantes
    const { data: notifications } = await supabase
      .from("notifications")
      .select("*")
      .or(`message.like.%${cardNumber}%,reported_card_id.in.(${reportedCards?.map(rc => rc.id).join(",") || "00000000-0000-0000-0000-000000000000"})`);

    console.log("🔔 Notifications trouvées:", notifications);

    return {
      userCards,
      profiles: profilesData,
      reportedCards,
      notifications,
      summary: {
        hasUserCard: (userCards?.length || 0) > 0,
        hasReportedCard: (reportedCards?.length || 0) > 0,
        hasNotification: (notifications?.length || 0) > 0,
        userInVacationMode: profilesData?.[0]?.is_on_vacation || false
      }
    };
  } catch (error) {
    console.error("❌ Erreur lors du diagnostic:", error);
    return null;
  }
};
