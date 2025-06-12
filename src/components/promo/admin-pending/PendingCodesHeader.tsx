
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Clock, RefreshCw } from "lucide-react";

interface PendingCodesHeaderProps {
  pendingCount: number;
  refreshing: boolean;
  onRefresh: () => void;
}

export const PendingCodesHeader = ({ pendingCount, refreshing, onRefresh }: PendingCodesHeaderProps) => {
  return (
    <CardTitle className="flex items-center gap-2">
      <Clock className="h-5 w-5 text-orange-600" />
      Codes Promo en Attente de Validation
      <Badge variant="outline" className="bg-orange-50 text-orange-700">
        {pendingCount} en attente
      </Badge>
      <Button
        onClick={onRefresh}
        disabled={refreshing}
        size="sm"
        variant="outline"
        className="ml-auto"
      >
        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
      </Button>
    </CardTitle>
  );
};
