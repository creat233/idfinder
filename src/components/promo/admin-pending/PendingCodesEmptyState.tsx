
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, AlertCircle } from "lucide-react";
import { PromoCodeData } from "@/types/promo";

interface PendingCodesEmptyStateProps {
  searchTerm: string;
  pendingCodes: PromoCodeData[];
  promoCodes: PromoCodeData[];
  onRefresh: () => void;
}

export const PendingCodesEmptyState = ({ 
  searchTerm, 
  pendingCodes, 
  promoCodes, 
  onRefresh 
}: PendingCodesEmptyStateProps) => {
  if (searchTerm && pendingCodes.length > 0) {
    return (
      <div className="text-center py-8">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
        <p className="text-gray-500">
          Aucun code ne correspond à votre recherche "<strong>{searchTerm}</strong>"
        </p>
      </div>
    );
  }

  if (promoCodes.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun code promo</h3>
        <p className="text-gray-500 mb-4">
          Il n'y a actuellement aucun code promo dans le système.
        </p>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <div className="text-green-600 text-2xl">✓</div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Tous les codes sont traités</h3>
      <p className="text-gray-500 mb-4">
        Il n'y a actuellement aucun code promo en attente d'activation.
      </p>
      <div className="text-sm text-gray-400">
        Total de codes dans le système: <strong>{promoCodes.length}</strong>
      </div>
      <Button onClick={onRefresh} variant="outline" className="mt-4">
        <RefreshCw className="h-4 w-4 mr-2" />
        Actualiser
      </Button>
    </div>
  );
};
