
import { Badge } from "@/components/ui/badge";
import { WifiOff, Cloud, RefreshCw } from "lucide-react";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { Button } from "@/components/ui/button";

export const ConnectionStatus = () => {
  const { isOnline, isSyncing, pendingChangesCount, forceSyncNow } = useOfflineSync();

  if (isOnline && pendingChangesCount === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {!isOnline && (
        <Badge variant="destructive" className="flex items-center gap-2">
          <WifiOff className="h-3 w-3" />
          Mode hors ligne
        </Badge>
      )}
      
      {pendingChangesCount > 0 && (
        <Badge 
          variant={isOnline ? "default" : "secondary"} 
          className="flex items-center gap-2 cursor-pointer"
          onClick={forceSyncNow}
        >
          {isSyncing ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <Cloud className="h-3 w-3" />
          )}
          {isSyncing ? 'Synchronisation...' : `${pendingChangesCount} modif. en attente`}
        </Badge>
      )}
    </div>
  );
};
