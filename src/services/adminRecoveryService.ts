
import { supabase } from "@/integrations/supabase/client";
import { ReportedCard, ReporterProfile, PromoUsage } from "@/types/adminRecoveries";

export const fetchReportedCards = async (): Promise<ReportedCard[]> => {
  console.log("🔍 Récupération des demandes de récupération...");
  
  const { data: reportedCards, error: cardsError } = await supabase
    .from("reported_cards")
    .select("*")
    .order("created_at", { ascending: false });

  if (cardsError) {
    console.error("❌ Erreur lors de la récupération des cartes:", cardsError);
    throw cardsError;
  }

  console.log("📋 Cartes trouvées:", reportedCards?.length || 0);
  return reportedCards || [];
};

export const fetchReporterProfile = async (reporterId: string): Promise<ReporterProfile | null> => {
  if (!reporterId) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("first_name, last_name, phone")
    .eq("id", reporterId)
    .single();

  if (profileError || !profile) return null;
  return profile;
};

export const fetchPromoUsage = async (ownerPhone: string): Promise<PromoUsage | null> => {
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

  if (promoError || !promoUsage || promoUsage.length === 0) return null;
  return promoUsage[0];
};

export const fetchPromoOwnerPhone = async (promoCodeOwnerId: string): Promise<string> => {
  const { data: promoOwnerProfile, error: promoOwnerError } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", promoCodeOwnerId)
    .single();

  if (promoOwnerError || !promoOwnerProfile) return "Non renseigné";
  return promoOwnerProfile.phone || "Non renseigné";
};
