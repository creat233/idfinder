
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

interface RecoveryActionButtonProps {
  onRecoveryClick: () => void;
}

export const RecoveryActionButton = ({ onRecoveryClick }: RecoveryActionButtonProps) => {
  return (
    <div className="text-center space-y-3 sm:space-y-4">
      {/* Main action button - responsive sizing */}
      <Button 
        onClick={onRecoveryClick}
        size="lg"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold 
                   py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg rounded-lg
                   shadow-lg hover:shadow-xl transition-all duration-200
                   group active:scale-[0.98]"
      >
        <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        <span>Récupérer ma carte</span>
        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
      </Button>
      
      {/* Pricing info - responsive text */}
      <div className="space-y-1 text-center">
        <p className="text-xs sm:text-sm text-gray-600">
          Frais de récupération : <span className="font-semibold text-gray-800">7000 FCFA</span>
        </p>
        <p className="text-xs text-green-600 font-medium">
          💰 Réductible avec un code promo
        </p>
      </div>

      {/* Mobile-specific help text */}
      <div className="sm:hidden text-center mt-3">
        <p className="text-xs text-gray-500 px-2">
          Appuyez pour commencer le processus de récupération
        </p>
      </div>
    </div>
  );
};
