
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { AllRecoveryData } from "@/types/adminRecoveries";
import { fetchReportedCards } from "@/services/adminRecoveryService";
import { processReportedCard } from "@/services/recoveryDataProcessor";

export const useAdminAllRecoveries = () => {
  const [recoveries, setRecoveries] = useState<AllRecoveryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchAllRecoveries = async () => {
    try {
      const reportedCards = await fetchReportedCards();

      if (reportedCards.length === 0) {
        console.log("📭 Aucune carte trouvée");
        setRecoveries([]);
        setLoading(false);
        return;
      }

      // Filtrer et traiter uniquement les cartes avec des demandes de récupération
      const enrichedRecoveries: AllRecoveryData[] = [];

      for (const card of reportedCards) {
        const recovery = await processReportedCard(card);
        if (recovery) {
          enrichedRecoveries.push(recovery);
        }
      }

      console.log(`🎉 Total des demandes de récupération: ${enrichedRecoveries.length}`);
      setRecoveries(enrichedRecoveries);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des données:", error);
      showError("Erreur", "Impossible de récupérer les données de récupération");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRecoveries();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('admin-recoveries-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reported_cards'
        },
        (payload) => {
          console.log("🔄 Changement détecté dans reported_cards:", payload);
          fetchAllRecoveries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    recoveries,
    loading,
    refetch: fetchAllRecoveries,
  };
};
