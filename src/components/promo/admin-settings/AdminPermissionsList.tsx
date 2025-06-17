
import { useAdminPermissionsManager } from "@/hooks/useAdminPermissionsManager";
import { AdminPermissionsToolbar } from "./AdminPermissionsToolbar";
import { AdminPermissionsTable } from "./AdminPermissionsTable";
import { AdminPermissionsEmptyState } from "./AdminPermissionsEmptyState";
import { Loader2 } from "lucide-react";

export const AdminPermissionsList = () => {
  const { permissions, loading, refetch } = useAdminPermissionsManager();

  console.log('📊 AdminPermissionsList - État:', { 
    loading, 
    permissionsCount: permissions.length,
    permissions: permissions.slice(0, 2) // Log des 2 premiers pour debug
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Chargement des permissions administrateur...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminPermissionsToolbar onRefresh={refetch} />
      {permissions.length > 0 ? (
        <AdminPermissionsTable permissions={permissions} onRefresh={refetch} />
      ) : (
        <AdminPermissionsEmptyState />
      )}
    </div>
  );
};
