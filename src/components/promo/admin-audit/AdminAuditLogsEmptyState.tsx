
import { Info } from "lucide-react";

export const AdminAuditLogsEmptyState = () => {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <Info className="mx-auto h-12 w-12" />
      <h3 className="mt-4 text-lg font-semibold">Aucun journal d'audit trouvé</h3>
      <p className="mt-2 text-sm">Les actions de sécurité et d'administration seront enregistrées ici.</p>
    </div>
  );
};
