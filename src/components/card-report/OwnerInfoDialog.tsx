
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OwnerInfoForm } from "./OwnerInfoForm";
import { RecoveryPriceSummary } from "./RecoveryPriceSummary";
import { RecoveryNextSteps } from "./RecoveryNextSteps";

interface OwnerInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: {
    id: string;
    card_number: string;
    document_type: string;
    location: string;
  };
}

export const OwnerInfoDialog = ({ isOpen, onClose, cardData }: OwnerInfoDialogProps) => {
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [baseFee] = useState(7000);
  const [discount, setDiscount] = useState(0);
  const [appliedPromoId, setAppliedPromoId] = useState<string | null>(null);
  const { toast } = useToast();

  // Charger automatiquement les informations du profil utilisateur
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Récupérer les informations du profil
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (profile) {
          const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          setOwnerName(fullName);
          setOwnerPhone(profile.phone || '');
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
    setDiscount(discountAmount);
    setAppliedPromoId(promoCodeId);
  };

  const handlePromoRemoved = () => {
    setDiscount(0);
    setAppliedPromoId(null);
  };

  const finalPrice = baseFee - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ownerName.trim() || !ownerPhone.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Appeler la fonction Edge pour envoyer l'email de notification
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
        title: "Demande envoyée",
        description: "Votre demande de récupération a été envoyée. Vous serez contacté prochainement.",
      });

      // Réinitialiser le formulaire et fermer la dialog
      setOwnerName("");
      setOwnerPhone("");
      setDiscount(0);
      setAppliedPromoId(null);
      onClose();
    } catch (error) {
      console.error("Error submitting recovery request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Confirmer votre identité
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Pour récupérer votre carte, nous avons besoin de vos informations de contact.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <OwnerInfoForm
            ownerName={ownerName}
            ownerPhone={ownerPhone}
            onOwnerNameChange={setOwnerName}
            onOwnerPhoneChange={setOwnerPhone}
            onPromoApplied={handlePromoApplied}
            onPromoRemoved={handlePromoRemoved}
          />

          <RecoveryPriceSummary
            cardData={cardData}
            baseFee={baseFee}
            discount={discount}
            finalPrice={finalPrice}
          />
          
          <RecoveryNextSteps finalPrice={finalPrice} />
          
          <DialogFooter className="gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-green-500 hover:bg-green-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi en cours..." : "Confirmer la récupération"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
