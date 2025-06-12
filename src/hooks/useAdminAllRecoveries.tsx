
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
  reporter_name: string;
  reporter_phone: string;
  reporter_id: string;
  final_price: number;
  promo_code?: string;
  promo_code_owner_id?: string;
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

      // Pour chaque carte, récupérer les infos du profil du signaleur et les codes promo
      const enrichedRecoveries: AllRecoveryData[] = [];

      for (const card of reportedCards) {
        // Récupérer le profil du signaleur
        let reporterProfile = null;
        if (card.reporter_id) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("first_name, last_name, phone")
            .eq("id", card.reporter_id)
            .single();

          if (!profileError && profile) {
            reporterProfile = profile;
          }
        }

        // Extraire les informations du propriétaire depuis la description
        const description = card.description || "";
        const ownerNameMatch = description.match(/Nom du propriétaire: ([^\n]+)/);
        const ownerPhoneMatch = description.match(/Téléphone: ([^\n]+)/);
        const finalPriceMatch = description.match(/Prix final: (\d+) FCFA/);
        const promoUsedMatch = description.match(/Code promo utilisé: Oui \(réduction de (\d+) FCFA\)/);

        // Chercher s'il y a une utilisation de code promo pour cette récupération
        let promoCode = null;
        let promoCodeOwnerId = null;
        let discountAmount = null;

        if (promoUsedMatch) {
          discountAmount = parseInt(promoUsedMatch[1]);
          
          // Chercher l'utilisation du code promo correspondante
          const ownerPhone = ownerPhoneMatch ? ownerPhoneMatch[1] : "";
          const { data: promoUsage, error: promoError } = await supabase
            .from("promo_usage")
            .select(`
              *,
              promo_codes (
                code,
                user_id
              )
            `)
            .eq("used_by_phone", ownerPhone)
            .eq("discount_amount", discountAmount)
            .order("created_at", { ascending: false })
            .limit(1);

          if (!promoError && promoUsage && promoUsage.length > 0) {
            const usage = promoUsage[0];
            promoCode = usage.promo_codes?.code;
            promoCodeOwnerId = usage.promo_codes?.user_id;
          }
        }

        // Informations du signaleur depuis le profil ou les données de la carte
        const reporterName = reporterProfile 
          ? `${reporterProfile.first_name || ''} ${reporterProfile.last_name || ''}`.trim()
          : "Non renseigné";
        const reporterPhone = reporterProfile?.phone || card.reporter_phone || "Non renseigné";

        const recovery: AllRecoveryData = {
          id: card.id,
          card_id: card.id,
          card_number: card.card_number,
          document_type: card.document_type,
          location: card.location,
          owner_name: ownerNameMatch ? ownerNameMatch[1] : "Non renseigné",
          owner_phone: ownerPhoneMatch ? ownerPhoneMatch[1] : card.reporter_phone || "Non renseigné",
          reporter_name: reporterName,
          reporter_phone: reporterPhone,
          reporter_id: card.reporter_id,
          final_price: finalPriceMatch ? parseInt(finalPriceMatch[1]) : 7000,
          created_at: card.created_at,
          status: card.status,
          promo_code: promoCode,
          promo_code_owner_id: promoCodeOwnerId,
          discount_amount: discountAmount
        };

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
