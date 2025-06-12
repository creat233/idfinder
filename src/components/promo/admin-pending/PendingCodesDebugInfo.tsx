
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
      
      {/* Afficher les détails de débogage */}
      {promoCodes.length > 0 && (
        <div className="text-xs bg-gray-50 p-2 rounded space-y-1">
          <strong>🔍 Tous les codes détectés:</strong>
          {promoCodes.map(code => (
            <div key={code.id} className="border-l-2 border-blue-200 pl-2">
              <div className="font-mono font-bold text-blue-600">{code.code}</div>
              <div className="text-xs">
                👤 {code.user_name} - 
                {code.is_active ? ' ✅ Actif' : ' ⏳ Inactif'} -
                {code.is_paid ? ' 💰 Payé' : ' ⏳ Non payé'}
              </div>
              <div className="text-xs text-gray-500">
                📅 {new Date(code.created_at).toLocaleString('fr-FR')} - 
                ID: {code.user_id.slice(0, 8)}...
              </div>
            </div>
          ))}
        </div>
      )}
      
      {pendingCodes.length > 0 && (
        <div className="text-orange-600 text-xs bg-orange-50 p-2 rounded">
          ⏳ {pendingCodes.length} code(s) en attente de validation
        </div>
      )}

      {promoCodes.length > 0 && pendingCodes.length === 0 && (
        <div className="text-blue-600 text-xs bg-blue-50 p-2 rounded">
          ✅ Tous les codes ont été traités ou activés
        </div>
      )}

      {promoCodes.length === 0 && (
        <div className="text-red-600 text-xs bg-red-50 p-2 rounded">
          ❌ Aucun code promo trouvé. Vérifiez la console pour plus de détails.
        </div>
      )}
    </div>
  );
};
