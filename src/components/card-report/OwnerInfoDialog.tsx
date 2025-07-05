
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOwnerInfoDialog } from "@/hooks/useOwnerInfoDialog";
import { OwnerInfoDialogHeader } from "./dialog/OwnerInfoDialogHeader";
import { OwnerInfoDialogContent } from "./dialog/OwnerInfoDialogContent";
import { OwnerInfoDialogFooter } from "./dialog/OwnerInfoDialogFooter";
import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const { currentCountry } = useTranslation();
  const [reporterPhone, setReporterPhone] = useState<string | null>(null);
  
  const {
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
  } = useOwnerInfoDialog(isOpen, cardData, currentCountry);

  // Récupérer le numéro du trouveur pour les cartes étudiantes et santé
  useEffect(() => {
    const fetchReporterPhone = async () => {
      if ((cardData.document_type === 'student_card' || cardData.document_type === 'health_card') && isOpen) {
        try {
          const { data, error } = await supabase
            .from('reported_cards')
            .select('reporter_phone')
            .eq('id', cardData.id)
            .single();

          if (!error && data?.reporter_phone) {
            setReporterPhone(data.reporter_phone);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du numéro:', error);
        }
      }
    };

    fetchReporterPhone();
  }, [cardData.id, cardData.document_type, isOpen]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[98vw] sm:w-[95vw] max-w-lg mx-auto h-[98vh] sm:h-auto sm:max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Header fixe */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
          <OwnerInfoDialogHeader />
        </div>
        
        {/* Contenu défilable */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
            <div className="flex-1 p-4 sm:p-6">
              <OwnerInfoDialogContent
                ownerName={ownerName}
                ownerPhone={ownerPhone}
                onOwnerNameChange={setOwnerName}
                onOwnerPhoneChange={setOwnerPhone}
                onPromoApplied={handlePromoApplied}
                onPromoRemoved={handlePromoRemoved}
                cardData={cardData}
                baseFee={baseFee}
                discount={discount}
                finalPrice={finalPrice}
                priceInfo={priceInfo}
                reporterPhone={reporterPhone}
              />
            </div>
            
            {/* Footer fixe */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 bg-white">
              <OwnerInfoDialogFooter onClose={onClose} isSubmitting={isSubmitting} />
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
