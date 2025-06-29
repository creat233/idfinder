
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

interface AdminPendingMCardsHeaderProps {
  pendingCount: number;
  totalPotentialRevenue: number;
}

export const AdminPendingMCardsHeader = ({ 
  pendingCount, 
  totalPotentialRevenue 
}: AdminPendingMCardsHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          mCards en attente de validation ({pendingCount})
        </div>
        {totalPotentialRevenue > 0 && (
          <Badge variant="secondary" className="text-lg px-3 py-1">
            Revenus potentiels: {totalPotentialRevenue.toLocaleString()} FCFA
          </Badge>
        )}
      </CardTitle>
    </CardHeader>
  );
};
