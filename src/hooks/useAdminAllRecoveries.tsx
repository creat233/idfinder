
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { AllRecoveryData } from "@/types/adminRecoveries";
import { processReportedCard } from "@/services/recoveryDataProcessor";

export const useAdminAllRecoveries = () => {
  const [recoveries, setRecoveries] = useState<AllRecoveryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useToast();

  const fetchAllRecoveries = async () => {
    try {
      console.log("🔄 Récupération de TOUTES les cartes signalées...");
      
      // Récupérer TOUTES les cartes signalées
      const { data: reportedCards, error } = await supabase
        .from("reported_cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Erreur lors de la récupération:", error);
        throw error;
      }

      if (!reportedCards || reportedCards.length === 0) {
        console.log("📭 Aucune carte trouvée");
        setRecoveries([]);
        setLoading(false);
        return;
      }

      console.log(`📋 ${reportedCards.length} cartes trouvées, analyse en cours...`);
      console.log("🔍 Cartes récupérées:", reportedCards.map(card => ({
        numero: card.card_number,
        statut: card.status,
        description: card.description ? "Oui" : "Non"
      })));

      // Traiter toutes les cartes pour identifier les demandes de récupération
      const enrichedRecoveries: AllRecoveryData[] = [];

      for (const card of reportedCards) {
        console.log(`🔍 Traitement de la carte ${card.card_number}...`);
        console.log(`📊 Statut: ${card.status}`);
        console.log(`📝 Description: ${card.description ? card.description.substring(0, 100) + "..." : "Aucune"}`);
        
        const recovery = await processReportedCard(card);
        if (recovery) {
          enrichedRecoveries.push(recovery);
          console.log(`✅ Carte ${card.card_number} ajoutée aux récupérations`);
        } else {
          console.log(`❌ Carte ${card.card_number} ignorée (pas de demande de récupération)`);
        }
      }

      console.log(`🎉 Total des demandes de récupération trouvées: ${enrichedRecoveries.length}`);
      
      // Afficher les détails des récupérations trouvées
      if (enrichedRecoveries.length > 0) {
        console.log("📋 Détails des récupérations:");
        enrichedRecoveries.forEach(recovery => {
          console.log(`- Carte: ${recovery.card_number}, Propriétaire: ${recovery.owner_name}, Statut: ${recovery.status}`);
        });
      }
      
      setRecoveries(enrichedRecoveries);
      
      if (enrichedRecoveries.length > 0) {
        showSuccess("Succès", `${enrichedRecoveries.length} demande(s) de récupération trouvée(s)`);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des données:", error);
      showError("Erreur", "Impossible de récupérer les données de récupération");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRecoveries();

    // Écouter les changements en temps réel sur toutes les cartes
    const channel = supabase
      .channel('admin-all-cards-changes')
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
          console.log("🔄 Données:", payload.new || payload.old);
          
          // Actualisation immédiate après un court délai
          setTimeout(() => {
            console.log("🔄 Actualisation automatique des données...");
            fetchAllRecoveries();
          }, 1000);
        }
      )
      .subscribe((status) => {
        console.log("📡 Statut de la souscription temps réel:", status);
        if (status === 'SUBSCRIBED') {
          console.log("✅ Souscription temps réel active pour toutes les cartes");
        }
      });

    return () => {
      console.log("🔌 Déconnexion du canal temps réel");
      supabase.removeChannel(channel);
    };
  }, []);

  // Fonction pour forcer l'actualisation
  const forceRefresh = async () => {
    console.log("🔄 Actualisation forcée demandée...");
    setLoading(true);
    await fetchAllRecoveries();
    showSuccess("Succès", "Données actualisées");
  };

  return {
    recoveries,
    loading,
    refetch: fetchAllRecoveries,
    forceRefresh,
  };
};
