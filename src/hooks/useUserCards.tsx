
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { offlineStorage } from "@/services/offlineStorage";
import { useOfflineSync } from "./useOfflineSync";

interface UserCard {
  id: string;
  card_number: string;
  document_type: string;
  card_holder_name?: string;
  is_active: boolean;
  created_at: string;
}

export const useUserCards = () => {
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();
  const { isOnline } = useOfflineSync();

  const fetchCards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mode hors ligne : charger depuis le cache
      if (!isOnline) {
        const cachedCards = offlineStorage.getAllUserCards();
        setCards(cachedCards);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_cards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const userCards = data || [];
      setCards(userCards);
      
      // Sauvegarder dans le cache
      userCards.forEach(card => offlineStorage.saveUserCard(card));
    } catch (error) {
      console.error("Error fetching cards:", error);
      
      // En cas d'erreur, essayer de charger depuis le cache
      const cachedCards = offlineStorage.getAllUserCards();
      if (cachedCards.length > 0) {
        setCards(cachedCards);
      } else {
        showError("Erreur", "Impossible de récupérer vos cartes");
      }
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardData: {
    card_number: string;
    document_type: string;
    card_holder_name?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const newCard = {
        id: `temp_${Date.now()}`,
        ...cardData,
        user_id: user.id,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      if (!isOnline) {
        // Mode hors ligne : sauvegarder localement
        offlineStorage.saveUserCard(newCard);
        offlineStorage.addPendingChange({
          type: 'user_card',
          action: 'create',
          data: newCard,
        });
        
        setCards(prev => [newCard, ...prev]);
        showSuccess("Carte ajoutée (hors ligne)", "Sera synchronisée à la reconnexion");
        return;
      }

      const { error } = await supabase.from("user_cards").insert({
        ...cardData,
        user_id: user.id,
      });

      if (error) throw error;
      
      fetchCards();
    } catch (error: any) {
      console.error("Error adding card:", error);
      showError("Erreur", "Impossible d'ajouter la carte");
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      if (!isOnline) {
        // Mode hors ligne
        offlineStorage.deleteUserCard(cardId);
        offlineStorage.addPendingChange({
          type: 'user_card',
          action: 'delete',
          data: { id: cardId },
        });
        
        setCards(prev => prev.filter(c => c.id !== cardId));
        showSuccess("Carte supprimée (hors ligne)", "Sera synchronisée à la reconnexion");
        return;
      }

      const { error } = await supabase
        .from("user_cards")
        .delete()
        .eq("id", cardId);

      if (error) throw error;
      
      offlineStorage.deleteUserCard(cardId);
      showSuccess("Carte supprimée", "Votre carte a été supprimée");
      fetchCards();
    } catch (error) {
      console.error("Error deleting card:", error);
      showError("Erreur", "Impossible de supprimer la carte");
    }
  };

  const toggleCardStatus = async (cardId: string) => {
    try {
      const currentCard = cards.find(card => card.id === cardId);
      if (!currentCard) return;

      const newStatus = !currentCard.is_active;
      const updatedCard = { ...currentCard, is_active: newStatus };

      if (!isOnline) {
        // Mode hors ligne
        offlineStorage.saveUserCard(updatedCard);
        offlineStorage.addPendingChange({
          type: 'user_card',
          action: 'update',
          data: { id: cardId, is_active: newStatus },
        });
        
        setCards(prev => prev.map(c => c.id === cardId ? updatedCard : c));
        showSuccess(
          newStatus ? "Carte activée (hors ligne)" : "Carte désactivée (hors ligne)",
          "Sera synchronisée à la reconnexion"
        );
        return;
      }

      const { error } = await supabase
        .from("user_cards")
        .update({ is_active: newStatus })
        .eq("id", cardId);

      if (error) throw error;
      
      offlineStorage.saveUserCard(updatedCard);
      showSuccess(
        newStatus ? "Carte activée" : "Carte désactivée",
        newStatus ? "Votre carte est maintenant surveillée" : "Votre carte n'est plus surveillée"
      );
      fetchCards();
    } catch (error) {
      console.error("Error updating card status:", error);
      showError("Erreur", "Impossible de modifier le statut de la carte");
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return {
    cards,
    loading,
    addCard,
    deleteCard,
    toggleCardStatus,
    refetch: fetchCards,
  };
};
