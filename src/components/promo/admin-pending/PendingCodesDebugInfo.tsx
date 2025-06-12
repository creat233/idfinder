
import { Database } from "lucide-react";
import { PromoCodeData } from "@/types/promo";

interface PendingCodesDebugInfoProps {
  promoCodes: PromoCodeData[];
  pendingCodes: PromoCodeData[];
}

export const PendingCodesDebugInfo = ({ promoCodes, pendingCodes }: PendingCodesDebugInfoProps) => {
  return (
    <div className="text-sm text-muted-foreground space-y-2">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        <span>
          Codes dans la base: {promoCodes.length} | 
          En attente: {pendingCodes.length} | 
          Actifs: {promoCodes.filter(c => c.is_active).length} | 
          Payés: {promoCodes.filter(c => c.is_paid).length}
        </span>
      </div>
      
      {/* Afficher les derniers codes créés pour le débogage */}
      {promoCodes.length > 0 && (
        <div className="text-xs bg-gray-50 p-2 rounded">
          <strong>Derniers codes:</strong>
          {promoCodes.slice(0, 3).map(code => (
            <div key={code.id} className="mt-1">
              {code.code} - {code.user_email} - 
              {code.is_active ? ' ✅ Actif' : ' ⏳ Inactif'} -
              {code.is_paid ? ' 💰 Payé' : ' ⏳ Non payé'}
            </div>
          ))}
        </div>
      )}
      
      {promoCodes.length > 0 && pendingCodes.length === 0 && (
        <div className="text-blue-600 text-xs">
          Tous les codes ont été traités ou activés
        </div>
      )}
    </div>
  );
};
