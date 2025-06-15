
import { useAdminPermissionsManager } from "@/hooks/useAdminPermissionsManager";
import { AdminPermissionsTable } from "./AdminPermissionsTable";
import { AdminPermissionsEmptyState } from "./AdminPermissionsEmptyState";
import { AdminPermissionsToolbar } from "./AdminPermissionsToolbar";

export const AdminPermissionsList = () => {
  const { permissions, loading, refetch } = useAdminPermissionsManager();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Gestion des Administrateurs</h3>
      <AdminPermissionsToolbar onRefresh={refetch} />
      {permissions.length > 0 ? (
        <AdminPermissionsTable permissions={permissions} />
      ) : (
        <AdminPermissionsEmptyState />
      )}
    </div>
  );
};
