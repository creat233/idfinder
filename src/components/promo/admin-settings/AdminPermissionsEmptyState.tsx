
import { Info } from "lucide-react";

export const AdminPermissionsEmptyState = () => {
  return (
    <div className="text-center py-10 px-4 border-dashed border-2 rounded-lg">
      <Info className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">Aucune permission trouvée</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Ajoutez votre premier administrateur pour commencer.
      </p>
    </div>
  );
};
