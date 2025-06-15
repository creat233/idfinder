
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";

interface AdminPermissionsToolbarProps {
  onRefresh: () => void;
}

export const AdminPermissionsToolbar = ({ onRefresh }: AdminPermissionsToolbarProps) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">Liste des utilisateurs avec des droits d'administration.</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un admin
        </Button>
      </div>
    </div>
  );
};
