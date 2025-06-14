
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
      console.log("🔍 Récupération des demandes de récupération...");
      
      // Récupérer toutes les cartes signalées
      const { data: reportedCards, error: cardsError } = await supabase
        .from("reported_cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (cardsError) {
        console.error("❌ Erreur lors de la récupération des cartes:", cardsError);
        throw cardsError;
      }

      console.log("📋 Cartes trouvées:", reportedCards?.length || 0);

      if (!reportedCards || reportedCards.length === 0) {
        console.log("📭 Aucune carte trouvée");
        setRecoveries([]);
        setLoading(false);
        return;
      }

      // Filtrer et traiter uniquement les cartes avec des demandes de récupération
      const enrichedRecoveries: AllRecoveryData[] = [];

      for (const card of reportedCards) {
        console.log("🔍 Analyse de la carte:", card.card_number);
        console.log("📝 Description:", card.description);
        console.log("📊 Statut:", card.status);
        
        const description = card.description || "";
        
        // Vérifier si c'est une vraie demande de récupération
        const hasOwnerInfo = description.includes("Nom du propriétaire:") && 
                           description.includes("Téléphone:");
        const hasRecoveryRequest = description.includes("Prix final:") || 
                                 description.includes("Prix à payer:");
        const isRecoveryStatus = card.status === 'recovery_requested';

        // Une demande de récupération doit avoir les infos du propriétaire ET être une vraie demande
        const isValidRecoveryRequest = hasOwnerInfo && (hasRecoveryRequest || isRecoveryStatus);

        console.log("✅ Critères de validation:");
        console.log("   - A les infos propriétaire:", hasOwnerInfo);
        console.log("   - A une demande de récupération:", hasRecoveryRequest);
        console.log("   - Statut récupération:", isRecoveryStatus);
        console.log("   - Est une demande valide:", isValidRecoveryRequest);

        if (!isValidRecoveryRequest) {
          console.log("❌ Carte ignorée - pas une demande de récupération valide");
          continue;
        }

        console.log("✅ Demande de récupération valide détectée");

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

        // Extraire les informations depuis la description
        let ownerName = "Propriétaire non renseigné";
        let ownerPhone = "Non renseigné";
        let finalPrice = 7000; // Prix par défaut
        let promoCode = null;
        let promoCodeOwnerId = null;
        let promoCodeOwnerPhone = null;
        let promoUsageId = null;
        let discountAmount = null;

        // Patterns pour extraire les infos
        const ownerNameMatch = description.match(/Nom du propriétaire:\s*([^\n\r]+)/i);
        const ownerPhoneMatch = description.match(/Téléphone:\s*([^\n\r]+)/i);
        const finalPriceMatch = description.match(/Prix (?:final|à payer):\s*(\d+)\s*FCFA/i);
        const promoUsedMatch = description.match(/Code promo utilisé:\s*Oui.*?réduction de (\d+)\s*FCFA/is);

        if (ownerNameMatch) {
          ownerName = ownerNameMatch[1].trim();
          console.log("👤 Nom propriétaire:", ownerName);
        }
        
        if (ownerPhoneMatch) {
          ownerPhone = ownerPhoneMatch[1].trim();
          console.log("📞 Téléphone propriétaire:", ownerPhone);
        }
        
        if (finalPriceMatch) {
          finalPrice = parseInt(finalPriceMatch[1]);
          console.log("💰 Prix final:", finalPrice);
        }

        // Chercher les informations de code promo si utilisé
        if (promoUsedMatch && ownerPhone !== "Non renseigné") {
          console.log("🎁 Code promo détecté, recherche des détails...");
          discountAmount = parseInt(promoUsedMatch[1]);
          
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
            .eq("used_by_phone", ownerPhone)
            .order("created_at", { ascending: false })
            .limit(1);

          if (!promoError && promoUsage && promoUsage.length > 0) {
            const usage = promoUsage[0];
            if (usage.promo_codes) {
              promoCode = usage.promo_codes.code;
              promoCodeOwnerId = usage.promo_codes.user_id;
              promoUsageId = usage.id;
              discountAmount = usage.discount_amount;

              console.log("🎫 Code promo trouvé:", promoCode);

              // Récupérer le téléphone du propriétaire du code promo
              if (promoCodeOwnerId) {
                const { data: promoOwnerProfile, error: promoOwnerError } = await supabase
                  .from("profiles")
                  .select("phone")
                  .eq("id", promoCodeOwnerId)
                  .single();

                if (!promoOwnerError && promoOwnerProfile) {
                  promoCodeOwnerPhone = promoOwnerProfile.phone || "Non renseigné";
                  console.log("📱 Téléphone propriétaire code promo:", promoCodeOwnerPhone);
                }
              }
            }
          }
        }

        // Informations du signaleur
        const reporterName = reporterProfile 
          ? `${reporterProfile.first_name || ''} ${reporterProfile.last_name || ''}`.trim()
          : "Signaleur non renseigné";
        const reporterPhone = reporterProfile?.phone || card.reporter_phone || "Non renseigné";

        console.log("👨‍💼 Signaleur:", reporterName, "-", reporterPhone);

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
        console.log("✅ Demande de récupération ajoutée:", {
          carte: recovery.card_number,
          propriétaire: recovery.owner_name,
          signaleur: recovery.reporter_name,
          prix: recovery.final_price,
          promo: recovery.promo_code
        });
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
