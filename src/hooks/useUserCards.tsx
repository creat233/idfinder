
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";

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

  const fetchCards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_cards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
      showError("Erreur", "Impossible de récupérer vos cartes");
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

      const { error } = await supabase.from("user_cards").insert({
        ...cardData,
        user_id: user.id,
      });

      if (error) throw error;
      
      // La notification toast a été retirée car une notification persistante est maintenant créée.
      fetchCards();
    } catch (error: any) {
      console.error("Error adding card:", error);
      showError("Erreur", "Impossible d'ajouter la carte");
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from("user_cards")
        .delete()
        .eq("id", cardId);

      if (error) throw error;
      
      showSuccess("Carte supprimée", "Votre carte a été supprimée");
      fetchCards();
    } catch (error) {
      console.error("Error deleting card:", error);
      showError("Erreur", "Impossible de supprimer la carte");
    }
  };

  const toggleCardStatus = async (cardId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("user_cards")
        .update({ is_active: isActive })
        .eq("id", cardId);

      if (error) throw error;
      
      showSuccess(
        isActive ? "Carte activée" : "Carte désactivée",
        isActive ? "Votre carte est maintenant surveillée" : "Votre carte n'est plus surveillée"
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
