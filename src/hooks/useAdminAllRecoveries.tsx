
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
      console.log("🔄 Récupération de toutes les cartes signalées...");
      const reportedCards = await fetchReportedCards();

      if (reportedCards.length === 0) {
        console.log("📭 Aucune carte trouvée");
        setRecoveries([]);
        setLoading(false);
        return;
      }

      console.log(`📋 ${reportedCards.length} cartes trouvées, analyse en cours...`);

      // Filtrer et traiter toutes les cartes avec des demandes de récupération
      const enrichedRecoveries: AllRecoveryData[] = [];

      for (const card of reportedCards) {
        console.log(`🔍 Traitement de la carte ${card.card_number}...`);
        console.log(`📊 Statut: ${card.status}, Description: ${card.description?.substring(0, 100)}...`);
        
        const recovery = await processReportedCard(card);
        if (recovery) {
          enrichedRecoveries.push(recovery);
          console.log(`✅ Carte ${card.card_number} ajoutée aux récupérations`);
        } else {
          console.log(`❌ Carte ${card.card_number} ignorée (pas de demande de récupération)`);
        }
      }

      console.log(`🎉 Total des demandes de récupération trouvées: ${enrichedRecoveries.length}`);
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

    // Écouter les changements en temps réel avec plus de détails
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
          console.log("🔄 Type d'événement:", payload.eventType);
          console.log("🔄 Nouvelles données:", payload.new);
          
          // Forcer une actualisation immédiate
          setTimeout(() => {
            console.log("🔄 Actualisation forcée des données...");
            fetchAllRecoveries();
          }, 500);
        }
      )
      .subscribe((status) => {
        console.log("📡 Statut de la souscription temps réel:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Ajouter une fonction pour forcer l'actualisation
  const forceRefresh = () => {
    console.log("🔄 Actualisation forcée demandée...");
    setLoading(true);
    fetchAllRecoveries();
  };

  return {
    recoveries,
    loading,
    refetch: fetchAllRecoveries,
    forceRefresh,
  };
};
