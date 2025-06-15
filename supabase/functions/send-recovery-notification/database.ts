
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { CardData, PromoData } from "./types.ts";

export const createSupabaseClient = (req: Request) => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );
};

export const fetchCardData = async (supabaseClient: any, cardId: string): Promise<CardData> => {
  console.log("📋 Récupération des données de la carte:", cardId);
  
  // Récupérer d'abord les données de la carte
  const { data: cardData, error: cardError } = await supabaseClient
    .from("reported_cards")
    .select("*")
    .eq("id", cardId)
    .single();

  if (cardError) {
    console.error("❌ Erreur lors de la récupération de la carte:", cardError);
    throw cardError;
  }

  if (!cardData) {
    throw new Error("Carte introuvable");
  }

  console.log("✅ Carte trouvée:", cardData.card_number);

  // Récupérer les informations du profil du signaleur séparément
  let reporterProfile = null;
  if (cardData.reporter_id) {
    console.log("👤 Récupération du profil du signaleur:", cardData.reporter_id);
    
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("first_name, last_name, phone")
      .eq("id", cardData.reporter_id)
      .single();

    if (!profileError && profile) {
      reporterProfile = profile;
      console.log("✅ Profil signaleur trouvé:", profile.first_name, profile.last_name);
    } else {
      console.log("⚠️ Profil signaleur non trouvé");
    }
  }

  // Ajouter les informations du profil aux données de la carte
  return {
    ...cardData,
    profiles: reporterProfile
  };
};

export const fetchPromoData = async (supabaseClient: any, promoCodeId: string): Promise<PromoData | null> => {
  console.log("🎫 Récupération des données du code promo:", promoCodeId);
  
  // D'abord récupérer les informations du code promo
  const { data: promoCode, error: promoError } = await supabaseClient
    .from("promo_codes")
    .select("id, code, user_id")
    .eq("id", promoCodeId)
    .single();

  if (promoError) {
    console.error("❌ Erreur lors de la récupération du code promo:", promoError);
    return null;
  }

  if (!promoCode) {
    console.log("⚠️ Code promo introuvable");
    return null;
  }

  // Ensuite récupérer le profil du propriétaire du code promo
  const { data: ownerProfile, error: ownerError } = await supabaseClient
    .from("profiles")
    .select("first_name, last_name, phone")
    .eq("id", promoCode.user_id)
    .single();

  if (ownerError) {
    console.error("❌ Erreur lors de la récupération du profil propriétaire:", ownerError);
  }

  const promoData = {
    ...promoCode,
    profiles: ownerProfile || null
  };

  console.log("✅ Code promo trouvé:", promoData.code);
  if (ownerProfile) {
    console.log("👤 Propriétaire du code promo:", ownerProfile.first_name, ownerProfile.last_name);
    console.log("📞 Téléphone propriétaire:", ownerProfile.phone);
  }

  return promoData;
};

export const recordPromoUsage = async (
  supabaseClient: any,
  promoCodeId: string,
  phone: string,
  discount: number,
  cardId: string
) => {
  console.log("📝 Enregistrement de l'utilisation du code promo");
  
  // Utiliser le service role key pour contourner les RLS
  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
  
  const { data, error } = await serviceClient
    .from("promo_usage")
    .insert({
      promo_code_id: promoCodeId,
      used_by_email: null,
      used_by_phone: phone,
      discount_amount: discount,
      reported_card_id: cardId,
    })
    .select()
    .single();

  if (error) {
    console.error("❌ Erreur lors de l'enregistrement:", error);
    // Ne pas faire échouer toute la fonction pour cette erreur
    console.log("⚠️ Continuons sans enregistrer l'utilisation du code promo");
    return null;
  }

  console.log("✅ Utilisation enregistrée:", data.id);
  return data;
};

export const updateCardStatus = async (supabaseClient: any, cardId: string) => {
  console.log("🔄 Mise à jour du statut de la carte");
  
  const { error } = await supabaseClient
    .from("reported_cards")
    .update({ status: "recovery_requested" })
    .eq("id", cardId);

  if (error) {
    console.error("❌ Erreur lors de la mise à jour:", error);
    throw error;
  }

  console.log("✅ Statut mis à jour");
};
