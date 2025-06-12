
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useOwnerInfoDialog } from "@/hooks/useOwnerInfoDialog";
import { OwnerInfoDialogHeader } from "./dialog/OwnerInfoDialogHeader";
import { OwnerInfoDialogContent } from "./dialog/OwnerInfoDialogContent";
import { OwnerInfoDialogFooter } from "./dialog/OwnerInfoDialogFooter";

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
  const {
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
  } = useOwnerInfoDialog(isOpen, cardData);

  const handleFormSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <OwnerInfoDialogHeader />
        
        <form onSubmit={handleFormSubmit}>
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
          />
          
          <OwnerInfoDialogFooter onClose={onClose} isSubmitting={isSubmitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
};
