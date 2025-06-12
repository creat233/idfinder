
import { Button } from "@/components/ui/button";

interface RecoveryActionButtonProps {
  onRecoveryClick: () => void;
}

export const RecoveryActionButton = ({ onRecoveryClick }: RecoveryActionButtonProps) => {
  return (
    <div className="text-center">
      <Button 
        onClick={onRecoveryClick}
        size="lg"
        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
      >
        Récupérer ma carte
      </Button>
      <p className="text-sm text-gray-500 mt-2">
        Frais de récupération : 7000 FCFA (réductible avec un code promo)
      </p>
    </div>
  );
};
