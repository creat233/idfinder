import { useState, useEffect, useCallback, useRef } from "react";
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
      
      // Récupérer TOUTES les cartes signalées, sans filtre de statut pour débugger
      const { data: reportedCards, error } = await supabase
        .from("reported_cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Erreur lors de la récupération:", error);
        throw error;
      }

      if (!reportedCards || reportedCards.length === 0) {
        console.log("📭 Aucune carte trouvée dans la base de données");
        setRecoveries([]);
        setLoading(false);
        return;
      }

      console.log(`📋 ${reportedCards.length} cartes trouvées dans la base, analyse en cours...`);
      
      // Afficher les détails de chaque carte pour débugger
      reportedCards.forEach((card, index) => {
        console.log(`🔍 Carte ${index + 1}/${reportedCards.length} - ${card.card_number}:`, {
          id: card.id,
          statut: card.status,
          aDescription: !!card.description,
          descriptionLength: card.description?.length || 0,
          descriptionDebut: card.description ? card.description.substring(0, 100) : "Aucune",
          reporterId: card.reporter_id,
          createdAt: card.created_at
        });
      });

      // Traiter toutes les cartes pour identifier les demandes de récupération
      const enrichedRecoveries: AllRecoveryData[] = [];

      for (const card of reportedCards) {
        console.log(`🔧 Traitement de la carte ${card.card_number}...`);
        
        try {
          const recovery = await processReportedCard(card);
          if (recovery) {
            enrichedRecoveries.push(recovery);
            console.log(`✅ Carte ${card.card_number} ajoutée aux récupérations - Prix: ${recovery.final_price} FCFA`);
          } else {
            console.log(`❌ Carte ${card.card_number} ignorée par le processeur`);
          }
        } catch (error) {
          console.error(`❌ Erreur lors du traitement de la carte ${card.card_number}:`, error);
        }
      }

      console.log(`🎉 Total des demandes de récupération trouvées: ${enrichedRecoveries.length}`);
      
      // Afficher les détails des récupérations trouvées
      if (enrichedRecoveries.length > 0) {
        console.log("📋 Récupérations validées:");
        enrichedRecoveries.forEach((recovery, index) => {
          console.log(`${index + 1}. Carte: ${recovery.card_number}, Propriétaire: ${recovery.owner_name}, Prix: ${recovery.final_price} FCFA, Statut: ${recovery.status}`);
        });
      } else {
        console.log("⚠️ Aucune demande de récupération trouvée - vérifiez la logique de validation");
      }
      
      setRecoveries(enrichedRecoveries);
      
      if (enrichedRecoveries.length > 0) {
        showSuccess("Succès", `${enrichedRecoveries.length} demande(s) de récupération trouvée(s)`);
      } else {
        console.log("🔍 Debug: Tentative de traitement moins strict...");
        // En mode debug, créer des récupérations pour toutes les cartes avec des données minimum
        const debugRecoveries: AllRecoveryData[] = reportedCards.map(card => ({
          id: card.id,
          card_id: card.id,
          card_number: card.card_number,
          document_type: card.document_type,
          location: card.location,
          owner_name: "Propriétaire à identifier",
          owner_phone: "À renseigner",
          reporter_name: "Signaleur",
          reporter_phone: card.reporter_phone || "Non renseigné",
          reporter_id: card.reporter_id,
          final_price: 7000,
          created_at: card.created_at,
          status: card.status || "recovery_requested"
        }));
        
        console.log(`🔧 Mode debug activé: ${debugRecoveries.length} cartes affichées`);
        setRecoveries(debugRecoveries);
        showSuccess("Debug", `${debugRecoveries.length} carte(s) affichée(s) en mode debug`);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des données:", error);
      showError("Erreur", "Impossible de récupérer les données de récupération");
    } finally {
      setLoading(false);
    }
  };

  const forceRefresh = useCallback(() => {
    fetchAllRecoveries();
  }, []);

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
          
          // Typer correctement payload.new comme un objet avec les propriétés de reported_cards
          const newData = payload.new as any;
          if (newData) {
            console.log("🔄 Nouvelles données:", {
              cardNumber: newData.card_number,
              status: newData.status,
              hasDescription: !!newData.description
            });
          }
          
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

  return {
    recoveries,
    loading,
    refetch: fetchAllRecoveries,
    forceRefresh, // <- exposé pour être utilisé après confirmation paiement
  };
};
