
import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { AdminUsersTableToolbar } from "./admin-users/AdminUsersTableToolbar";
import { AdminUsersTable } from "./admin-users/AdminUsersTable";
import { AdminUsersEmptyState } from "./admin-users/AdminUsersEmptyState";

export const AdminUsersList = () => {
  const { users, loading, refetch } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            Gestion des Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Users className="h-5 w-5" />
          Gestion des Utilisateurs ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AdminUsersTableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={refetch}
          resultCount={filteredUsers.length}
        />
        {filteredUsers.length > 0 ? (
          <AdminUsersTable users={filteredUsers} />
        ) : (
          <AdminUsersEmptyState searchTerm={searchTerm} />
        )}
      </CardContent>
    </Card>
  );
};
