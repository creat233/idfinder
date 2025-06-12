
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OwnerInfoDialogFooterProps {
  onClose: () => void;
  isSubmitting: boolean;
}

export const OwnerInfoDialogFooter = ({ onClose, isSubmitting }: OwnerInfoDialogFooterProps) => {
  return (
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
  );
};
