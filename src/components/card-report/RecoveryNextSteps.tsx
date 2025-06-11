
interface RecoveryNextStepsProps {
  finalPrice: number;
}

export const RecoveryNextSteps = ({ finalPrice }: RecoveryNextStepsProps) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <p className="text-sm text-blue-800">
        <strong>Prochaines étapes :</strong>
      </p>
      <ul className="text-sm text-blue-700 mt-2 space-y-1">
        <li>• Vérification de votre identité</li>
        <li>• Contact avec la personne qui a trouvé votre carte</li>
        <li>• Organisation de la récupération ou livraison</li>
        <li>• Paiement des frais : {finalPrice} FCFA + livraison si applicable</li>
      </ul>
    </div>
  );
};
