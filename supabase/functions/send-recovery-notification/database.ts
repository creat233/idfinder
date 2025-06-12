
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { CardData, PromoData } from "./types.ts";

export const createSupabaseClient = (req: Request) => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );
};

export const fetchCardData = async (supabaseClient: any, cardId: string): Promise<CardData> => {
  const { data: cardData, error: cardError } = await supabaseClient
    .from("reported_cards")
    .select(`
      *,
      profiles!reported_cards_reporter_id_fkey (
        first_name,
        last_name,
        phone
      )
    `)
    .eq("id", cardId)
    .single();

  if (cardError) {
    console.error("Error fetching card data:", cardError);
    throw cardError;
  }

  if (!cardData) {
    throw new Error("Card not found");
  }

  return cardData;
};

export const fetchPromoData = async (supabaseClient: any, promoCodeId: string): Promise<PromoData | null> => {
  const { data: promoData, error: promoError } = await supabaseClient
    .from("promo_codes")
    .select(`
      code, 
      user_id,
      profiles!promo_codes_user_id_fkey (
        first_name,
        last_name,
        phone
      )
    `)
    .eq("id", promoCodeId)
    .single();

  if (promoError || !promoData) {
    return null;
  }

  return promoData;
};

export const recordPromoUsage = async (
  supabaseClient: any,
  promoCodeId: string,
  phone: string,
  discount: number
) => {
  await supabaseClient.from("promo_usage").insert({
    promo_code_id: promoCodeId,
    used_by_email: null,
    used_by_phone: phone,
    discount_amount: discount,
  });
};

export const updateCardStatus = async (supabaseClient: any, cardId: string) => {
  await supabaseClient
    .from("reported_cards")
    .update({ status: "recovery_requested" })
    .eq("id", cardId);
};
