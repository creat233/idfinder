
import { Check } from "lucide-react";

export const PricingFooter = () => {
  return (
    <div className="mt-12 sm:mt-16 text-center">
      <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-3 text-white">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
          <span className="text-sm sm:text-base">Hébergement gratuit</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
          <span className="text-sm sm:text-base">Mises à jour automatiques</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
          <span className="text-sm sm:text-base">Support inclus</span>
        </div>
      </div>
    </div>
  );
};
