
import { CreditCard, AlertCircle } from "lucide-react";

export const AdminPendingMCardsEmptyState = () => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aucune mCard en attente de validation
      </h3>
      <p className="text-gray-500 mb-4">
        Toutes les cartes créées avec des plans payants apparaîtront ici en attente de confirmation de paiement.
      </p>
      <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-lg px-4 py-2 mx-auto max-w-md">
        <AlertCircle className="h-4 w-4" />
        <span>Les cartes avec le statut "pending_payment" s'afficheront automatiquement</span>
      </div>
    </div>
  );
};
