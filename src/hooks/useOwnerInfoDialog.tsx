
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useOwnerInfoDialog = (isOpen: boolean, cardData: any) => {
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [baseFee] = useState(7000);
  const [discount, setDiscount] = useState(0);
  const [appliedPromoId, setAppliedPromoId] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setDiscount(0);
      setAppliedPromoId(null);
    }
  }, [isOpen]);

  // Load user profile automatically
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone, country')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (profile) {
          if (!ownerName && (profile.first_name || profile.last_name)) {
            const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
            setOwnerName(fullName);
          }
          
          if (!ownerPhone && profile.phone) {
            setOwnerPhone(profile.phone);
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    if (isOpen) {
      loadUserProfile();
    }
  }, [isOpen]);

  const handlePromoApplied = (discountAmount: number, promoCodeId: string) => {
    console.log("Promo applied in dialog:", { discountAmount, promoCodeId });
    setDiscount(discountAmount);
    setAppliedPromoId(promoCodeId);
    
    toast({
      title: "Code promo appliqué",
      description: `Réduction de ${discountAmount} FCFA appliquée avec succès`,
    });
  };

  const handlePromoRemoved = () => {
    console.log("Promo removed in dialog");
    setDiscount(0);
    setAppliedPromoId(null);
    
    toast({
      title: "Code promo retiré",
      description: "La réduction a été annulée",
    });
  };

  const finalPrice = Math.max(0, baseFee - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ownerName.trim() || !ownerPhone.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting recovery request with:", {
        cardId: cardData.id,
        ownerInfo: { name: ownerName.trim(), phone: ownerPhone.trim() },
        promoInfo: appliedPromoId ? {
          promoCodeId: appliedPromoId,
          discount: discount,
          finalPrice: finalPrice
        } : null,
        finalPrice: finalPrice
      });

      const { error } = await supabase.functions.invoke('send-recovery-notification', {
        body: {
          cardId: cardData.id,
          ownerInfo: {
            name: ownerName.trim(),
            phone: ownerPhone.trim(),
          },
          promoInfo: appliedPromoId ? {
            promoCodeId: appliedPromoId,
            discount: discount,
            finalPrice: finalPrice
          } : null
        }
      });

      if (error) {
        console.error('Error calling edge function:', error);
        throw error;
      }

      toast({
        title: "Demande envoyée avec succès",
        description: `Votre demande de récupération a été envoyée à l'administration. Prix à payer: ${finalPrice} FCFA + livraison si applicable.`,
      });

      return true;
    } catch (error) {
      console.error("Error submitting recovery request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer ou contacter le support.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setOwnerName("");
    setOwnerPhone("");
    setDiscount(0);
    setAppliedPromoId(null);
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
    handlePromoApplied,
    handlePromoRemoved,
    handleSubmit,
    resetForm,
  };
};
