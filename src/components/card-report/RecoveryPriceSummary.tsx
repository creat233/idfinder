
interface RecoveryPriceSummaryProps {
  cardData: {
    card_number: string;
    location: string;
  };
  baseFee: number;
  discount: number;
  finalPrice: number;
}

export const RecoveryPriceSummary = ({
  cardData,
  baseFee,
  discount,
  finalPrice,
}: RecoveryPriceSummaryProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-sm text-gray-700 mb-2">
        <strong>Récapitulatif :</strong>
      </p>
      <p className="text-sm"><strong>Numéro :</strong> {cardData.card_number}</p>
      <p className="text-sm"><strong>Lieu :</strong> {cardData.location}</p>
      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-sm"><strong>Frais de récupération :</strong> {baseFee} FCFA</p>
        {discount > 0 && (
          <p className="text-sm text-green-600"><strong>Réduction :</strong> -{discount} FCFA</p>
        )}
        <p className="text-lg font-semibold text-gray-800">
          <strong>Total à payer :</strong> {finalPrice} FCFA {discount > 0 && '+ livraison si applicable'}
        </p>
      </div>
    </div>
  );
};
