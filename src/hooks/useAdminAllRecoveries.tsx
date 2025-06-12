
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";

interface AllRecoveryData {
  id: string;
  card_id: string;
  card_number: string;
  document_type: string;
  location: string;
  owner_name: string;
  owner_phone: string;
  final_price: number;
  promo_code?: string;
  discount_amount?: number;
  created_at: string;
  status: string;
}

export const useAdminAllRecoveries = () => {
  const [recoveries, setRecoveries] = useState<AllRecoveryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchAllRecoveries = async () => {
    try {
      console.log("Récupération de toutes les demandes de récupération...");
      
      // Récupérer toutes les cartes signalées avec statut "recovery_requested"
      const { data: reportedCards, error: cardsError } = await supabase
        .from("reported_cards")
        .select("*")
        .eq("status", "recovery_requested")
        .order("created_at", { ascending: false });

      if (cardsError) {
        console.error("Erreur lors de la récupération des cartes:", cardsError);
        throw cardsError;
      }

      console.log("Cartes récupérées:", reportedCards);

      if (!reportedCards || reportedCards.length === 0) {
        setRecoveries([]);
        setLoading(false);
        return;
      }

      // Pour chaque carte, récupérer les utilisations de codes promo si elles existent
      const enrichedRecoveries: AllRecoveryData[] = [];

      for (const card of reportedCards) {
        // Chercher s'il y a une utilisation de code promo pour cette carte
        const { data: promoUsage, error: promoError } = await supabase
          .from("promo_usage")
          .select(`
            *,
            promo_codes (
              code,
              user_id
            )
          `)
          .eq("used_by_phone", card.reporter_phone)
          .order("created_at", { ascending: false })
          .limit(1);

        if (promoError) {
          console.error("Erreur lors de la vérification du code promo:", promoError);
        }

        // Extraire les informations du propriétaire depuis la description
        const description = card.description || "";
        const ownerNameMatch = description.match(/Nom du propriétaire: ([^\n]+)/);
        const ownerPhoneMatch = description.match(/Téléphone: ([^\n]+)/);
        const finalPriceMatch = description.match(/Prix final: (\d+) FCFA/);

        const recovery: AllRecoveryData = {
          id: card.id,
          card_id: card.id,
          card_number: card.card_number,
          document_type: card.document_type,
          location: card.location,
          owner_name: ownerNameMatch ? ownerNameMatch[1] : "Non renseigné",
          owner_phone: ownerPhoneMatch ? ownerPhoneMatch[1] : card.reporter_phone || "Non renseigné",
          final_price: finalPriceMatch ? parseInt(finalPriceMatch[1]) : 7000,
          created_at: card.created_at,
          status: card.status
        };

        // Ajouter les informations du code promo si disponible
        if (promoUsage && promoUsage.length > 0) {
          const usage = promoUsage[0];
          recovery.promo_code = usage.promo_codes?.code;
          recovery.discount_amount = usage.discount_amount;
        }

        enrichedRecoveries.push(recovery);
      }

      console.log("Demandes de récupération enrichies:", enrichedRecoveries);
      setRecoveries(enrichedRecoveries);
    } catch (error) {
      console.error("Error fetching all recovery data:", error);
      showError("Erreur", "Impossible de récupérer les données de récupération");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRecoveries();
  }, []);

  return {
    recoveries,
    loading,
    refetch: fetchAllRecoveries,
  };
};
