
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Clock, RefreshCw } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface PendingCodesHeaderProps {
  pendingCount: number;
  refreshing: boolean;
  onRefresh: () => void;
}

export const PendingCodesHeader = ({ pendingCount, refreshing, onRefresh }: PendingCodesHeaderProps) => {
  const { t } = useTranslation();
  return (
    <CardTitle className="flex items-center gap-2">
      <Clock className="h-5 w-5 text-orange-600" />
      {t("pending_codes_title")}
      <Badge variant="outline" className="bg-orange-50 text-orange-700">
        {t("pending_codes_count", { count: pendingCount })}
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
