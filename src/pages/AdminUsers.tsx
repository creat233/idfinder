import { Header } from "@/components/Header";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminRoute } from "@/components/AdminRoute";

const AdminUsersPage = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <AdminUsers />
        </main>
      </div>
    </AdminRoute>
  );
};

export default AdminUsersPage;