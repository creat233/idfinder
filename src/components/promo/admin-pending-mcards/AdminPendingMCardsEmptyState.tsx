
import { CreditCard, CheckCircle } from "lucide-react";

export const AdminPendingMCardsEmptyState = () => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Toutes les mCards sont activées !
      </h3>
      <p className="text-gray-500 mb-4">
        Il n'y a actuellement aucune carte en attente d'activation. Toutes les cartes créées sont déjà actives.
      </p>
      <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2 mx-auto max-w-md">
        <CreditCard className="h-4 w-4" />
        <span>Les nouvelles cartes créées apparaîtront automatiquement ici</span>
      </div>
    </div>
  );
};
