
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PromoCodeData } from "@/types/promo";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";

interface PendingCodesDebugInfoProps {
  promoCodes: PromoCodeData[];
  pendingCodes: PromoCodeData[];
}

export const PendingCodesDebugInfo = ({ promoCodes, pendingCodes }: PendingCodesDebugInfoProps) => {
  const [showDebug, setShowDebug] = useState(false);

  const activeNotPaid = promoCodes.filter(c => c.is_active && !c.is_paid);
  const notActiveButPaid = promoCodes.filter(c => !c.is_active && c.is_paid);
  const activeAndPaid = promoCodes.filter(c => c.is_active && c.is_paid);

  return (
    <div className="space-y-2">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>
              Total: <strong>{promoCodes.length}</strong> codes | 
              En attente: <strong>{pendingCodes.length}</strong> | 
              Actifs: <strong>{activeAndPaid.length}</strong>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
              className="ml-2"
            >
              {showDebug ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Debug
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {showDebug && (
        <Alert>
          <AlertDescription>
            <div className="space-y-2 text-xs">
              <div><strong>Détails des codes:</strong></div>
              <div>• En attente (non actif + non payé): {pendingCodes.length}</div>
              <div>• Actifs mais non payés: {activeNotPaid.length}</div>
              <div>• Non actifs mais payés: {notActiveButPaid.length}</div>
              <div>• Actifs et payés: {activeAndPaid.length}</div>
              
              {promoCodes.length > 0 && (
                <div className="mt-2">
                  <strong>Échantillon des codes:</strong>
                  <div className="max-h-32 overflow-y-auto">
                    {promoCodes.slice(0, 5).map(c => (
                      <div key={c.id} className="text-xs">
                        {c.code}: active={String(c.is_active)}, paid={String(c.is_paid)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
