
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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
  return (
    <div className="text-center py-8">
      <div className="text-muted-foreground mb-4">
        {searchTerm ? "Aucun code en attente ne correspond à votre recherche" : "Aucun code promo en attente de validation"}
      </div>
      {pendingCodes.length === 0 && promoCodes.length > 0 && (
        <div className="text-sm text-blue-600">
          ✅ Tous les codes ont été traités. Total de codes dans le système: {promoCodes.length}
        </div>
      )}
      {promoCodes.length === 0 && (
        <div className="text-sm text-gray-500 space-y-2">
          <div>❌ Aucun code promo trouvé dans la base de données.</div>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      )}
    </div>
  );
};
