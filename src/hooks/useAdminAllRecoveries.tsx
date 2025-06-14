
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
  promo_code_owner_phone?: string;
  promo_usage_id?: string;
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
      console.log("Récupération des demandes de récupération...");
      
      // Récupérer seulement les cartes avec des informations de récupération dans la description
      const { data: reportedCards, error: cardsError } = await supabase
        .from("reported_cards")
        .select("*")
        .ilike("description", "%Nom du propriétaire:%")
        .order("created_at", { ascending: false });

      if (cardsError) {
        console.error("Erreur lors de la récupération des cartes:", cardsError);
        throw cardsError;
      }

      console.log("Cartes avec demandes de récupération:", reportedCards?.length || 0);

      if (!reportedCards || reportedCards.length === 0) {
        setRecoveries([]);
        setLoading(false);
        return;
      }

      // Pour chaque carte, créer une entrée de récupération
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

        // Extraire les informations de récupération depuis la description
        const description = card.description || "";
        
        // Vérifier que c'est bien une demande de récupération
        if (!description.includes("Nom du propriétaire:")) {
          continue; // Passer cette carte car ce n'est pas une vraie demande de récupération
        }

        let ownerName = "Propriétaire non renseigné";
        let ownerPhone = "Non renseigné";
        let finalPrice = 7000; // Prix par défaut
        let promoCode = null;
        let promoCodeOwnerId = null;
        let promoCodeOwnerPhone = null;
        let promoUsageId = null;
        let discountAmount = null;

        // Extraire les informations du propriétaire depuis la description
        const ownerNameMatch = description.match(/Nom du propriétaire: ([^\n]+)/);
        const ownerPhoneMatch = description.match(/Téléphone: ([^\n]+)/);
        const finalPriceMatch = description.match(/Prix final: (\d+) FCFA/);
        const promoUsedMatch = description.match(/Code promo utilisé: Oui \(réduction de (\d+) FCFA\)/);

        if (ownerNameMatch) ownerName = ownerNameMatch[1];
        if (ownerPhoneMatch) ownerPhone = ownerPhoneMatch[1];
        if (finalPriceMatch) finalPrice = parseInt(finalPriceMatch[1]);

        // Chercher s'il y a une utilisation de code promo pour cette récupération
        if (promoUsedMatch && ownerPhoneMatch) {
          discountAmount = parseInt(promoUsedMatch[1]);
          const phoneToSearch = ownerPhoneMatch[1];
          
          // Chercher l'utilisation du code promo correspondante
          const { data: promoUsage, error: promoError } = await supabase
            .from("promo_usage")
            .select(`
              id,
              discount_amount,
              promo_codes (
                code,
                user_id
              )
            `)
            .eq("used_by_phone", phoneToSearch)
            .order("created_at", { ascending: false })
            .limit(1);

          if (!promoError && promoUsage && promoUsage.length > 0) {
            const usage = promoUsage[0];
            if (usage.promo_codes) {
              promoCode = usage.promo_codes.code;
              promoCodeOwnerId = usage.promo_codes.user_id;
              promoUsageId = usage.id;
              discountAmount = usage.discount_amount;

              // Récupérer le téléphone du propriétaire du code promo
              if (promoCodeOwnerId) {
                const { data: promoOwnerProfile, error: promoOwnerError } = await supabase
                  .from("profiles")
                  .select("phone")
                  .eq("id", promoCodeOwnerId)
                  .single();

                if (!promoOwnerError && promoOwnerProfile) {
                  promoCodeOwnerPhone = promoOwnerProfile.phone || "Non renseigné";
                }
              }
            }
          }
        }

        // Informations du signaleur depuis le profil ou les données de la carte
        const reporterName = reporterProfile 
          ? `${reporterProfile.first_name || ''} ${reporterProfile.last_name || ''}`.trim()
          : "Signaleur non renseigné";
        const reporterPhone = reporterProfile?.phone || card.reporter_phone || "Non renseigné";

        const recovery: AllRecoveryData = {
          id: card.id,
          card_id: card.id,
          card_number: card.card_number,
          document_type: card.document_type,
          location: card.location,
          owner_name: ownerName,
          owner_phone: ownerPhone,
          reporter_name: reporterName,
          reporter_phone: reporterPhone,
          reporter_id: card.reporter_id,
          final_price: finalPrice,
          created_at: card.created_at,
          status: card.status || "pending",
          promo_code: promoCode,
          promo_code_owner_id: promoCodeOwnerId,
          promo_code_owner_phone: promoCodeOwnerPhone,
          promo_usage_id: promoUsageId,
          discount_amount: discountAmount
        };

        enrichedRecoveries.push(recovery);
      }

      console.log("Vraies demandes de récupération créées:", enrichedRecoveries.length);
      setRecoveries(enrichedRecoveries);
    } catch (error) {
      console.error("Error fetching recovery data:", error);
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
