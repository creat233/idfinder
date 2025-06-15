
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { getPriceInfoForCountry, PriceInfo } from "@/utils/pricing";
import { Country } from "@/utils/translations";

export const useOwnerInfoDialog = (isOpen: boolean, cardData: any, currentCountry: Country) => {
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [promoCodeId, setPromoCodeId] = useState<string>("");
  const { showSuccess, showError } = useToast();

  const priceInfo: PriceInfo = useMemo(() => getPriceInfoForCountry(currentCountry), [currentCountry]);

  const baseFee = priceInfo.baseFee;
  const finalPrice = baseFee - discount;

  const handlePromoApplied = (discountAmount: number, codeId: string) => {
    console.log("Code promo appliqué:", { discountAmount, codeId });
    setDiscount(discountAmount);
    setPromoCodeId(codeId);
  };

  const handlePromoRemoved = () => {
    console.log("Code promo retiré");
    setDiscount(0);
    setPromoCodeId("");
  };

  const resetForm = () => {
    setOwnerName("");
    setOwnerPhone("");
    setDiscount(0);
    setPromoCodeId("");
  };

  const handleSubmit = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();
    
    if (!ownerName.trim()) {
      showError("Erreur", "Veuillez saisir votre nom complet");
      return false;
    }

    if (!ownerPhone.trim() || ownerPhone.length < 10) {
      showError("Erreur", "Veuillez saisir un numéro de téléphone valide");
      return false;
    }

    try {
      setIsSubmitting(true);
      console.log("Envoi de la demande de récupération...");

      const requestData = {
        cardId: cardData.id,
        ownerInfo: {
          name: ownerName.trim(),
          phone: ownerPhone.trim()
        },
        promoInfo: promoCodeId ? {
          promoCodeId,
          discount,
          finalPrice
        } : null,
        priceInfo: {
          baseFee: priceInfo.baseFee,
          finalPrice: finalPrice,
          currency: priceInfo.currency,
          symbol: priceInfo.symbol,
        }
      };

      console.log("Données de la demande:", requestData);

      const { data, error } = await supabase.functions.invoke('send-recovery-notification', {
        body: requestData
      });

      if (error) {
        console.error("Erreur fonction:", error);
        throw error;
      }

      console.log("Réponse de la fonction:", data);

      showSuccess(
        "Demande envoyée", 
        `Votre demande de récupération a été envoyée avec succès. Prix à payer: ${finalPrice} ${priceInfo.symbol}`
      );

      return true;
    } catch (error: any) {
      console.error("Erreur lors de l'envoi:", error);
      showError(
        "Erreur", 
        error.message || "Une erreur est survenue lors de l'envoi de votre demande"
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ownerName,
    setOwnerName,
    ownerPhone,
    setOwnerPhone,
    isSubmitting,
    baseFee,
    discount,
    finalPrice,
    priceInfo,
    handlePromoApplied,
    handlePromoRemoved,
    handleSubmit,
    resetForm,
  };
};
