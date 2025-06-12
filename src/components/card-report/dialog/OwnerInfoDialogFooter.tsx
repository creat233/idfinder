
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OwnerInfoDialogFooterProps {
  onClose: () => void;
  isSubmitting: boolean;
}

export const OwnerInfoDialogFooter = ({ onClose, isSubmitting }: OwnerInfoDialogFooterProps) => {
  return (
    <DialogFooter className="gap-2 sm:gap-3 flex-col sm:flex-row">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
        disabled={isSubmitting}
        className="w-full sm:w-auto order-2 sm:order-1"
      >
        Annuler
      </Button>
      <Button 
        type="submit" 
        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 order-1 sm:order-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Envoi en cours..." : "Confirmer la récupération"}
      </Button>
    </DialogFooter>
  );
};
