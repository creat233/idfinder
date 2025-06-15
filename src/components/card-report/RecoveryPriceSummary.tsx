
import { PriceInfo } from "@/utils/pricing";

interface RecoveryPriceSummaryProps {
  cardData: {
    card_number: string;
    location: string;
  };
  baseFee: number;
  discount: number;
  finalPrice: number;
  priceInfo: PriceInfo;
}

export const RecoveryPriceSummary = ({
  cardData,
  baseFee,
  discount,
  finalPrice,
  priceInfo,
}: RecoveryPriceSummaryProps) => {
  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border">
      <p className="text-sm sm:text-base text-gray-700 mb-3 font-semibold">
        Récapitulatif :
      </p>
      
      <div className="space-y-2 text-xs sm:text-sm">
        <div className="flex justify-between items-start">
          <span className="font-medium">Numéro :</span>
          <span className="text-right font-mono break-all ml-2">{cardData.card_number}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <span className="font-medium">Lieu :</span>
          <span className="text-right ml-2 break-words">{cardData.location}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
        <div className="flex justify-between items-center text-sm sm:text-base">
          <span className="font-medium">Frais de récupération :</span>
          <span>{baseFee} {priceInfo.symbol}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between items-center text-sm text-green-600">
            <span className="font-medium">Réduction :</span>
            <span>-{discount} {priceInfo.symbol}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-base sm:text-lg font-bold text-gray-800 pt-2 border-t border-gray-300">
          <span>Total à payer :</span>
          <span>{finalPrice} {priceInfo.symbol}</span>
        </div>
        
        {discount > 0 && (
          <p className="text-xs text-gray-500 text-center mt-2">
            + livraison si applicable
          </p>
        )}
      </div>
    </div>
  );
};
