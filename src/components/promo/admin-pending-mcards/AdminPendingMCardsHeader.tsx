
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, AlertTriangle } from "lucide-react";

interface AdminPendingMCardsHeaderProps {
  pendingCount: number;
  totalPotentialRevenue: number;
}

export const AdminPendingMCardsHeader = ({ 
  pendingCount, 
  totalPotentialRevenue 
}: AdminPendingMCardsHeaderProps) => {
  return (
    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              mCards en attente de validation
            </h2>
            <p className="text-sm text-gray-600 font-normal">
              Confirmez les paiements mobile money pour activer les cartes
            </p>
          </div>
          <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800">
            {pendingCount} en attente
          </Badge>
        </div>
        
        <div className="text-right">
          {totalPotentialRevenue > 0 && (
            <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 text-lg px-4 py-2">
              <span className="font-semibold">
                Revenus potentiels: {totalPotentialRevenue.toLocaleString()} FCFA
              </span>
            </Badge>
          )}
          {pendingCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
              <AlertTriangle className="h-3 w-3" />
              <span>{pendingCount} carte{pendingCount > 1 ? 's' : ''} nécessite{pendingCount > 1 ? 'nt' : ''} une confirmation</span>
            </div>
          )}
        </div>
      </CardTitle>
    </CardHeader>
  );
};
