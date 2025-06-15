
import { PriceInfo } from "@/utils/pricing";

interface RecoveryNextStepsProps {
  finalPrice: number;
  priceInfo: PriceInfo;
}

export const RecoveryNextSteps = ({ finalPrice, priceInfo }: RecoveryNextStepsProps) => {
  return (
    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
      <p className="text-sm sm:text-base text-blue-800 font-semibold mb-2">
        Prochaines étapes :
      </p>
      <ul className="text-xs sm:text-sm text-blue-700 space-y-1 sm:space-y-2">
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <span>Vérification de votre identité</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <span>Contact avec la personne qui a trouvé votre carte</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <span>Organisation de la récupération ou livraison</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <span>Paiement des frais : <span className="font-semibold">{finalPrice} {priceInfo.symbol}</span> + livraison si applicable</span>
        </li>
      </ul>
    </div>
  );
};
