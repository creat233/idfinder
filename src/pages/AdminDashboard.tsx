import { Header } from "@/components/Header";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminRoute } from "@/components/AdminRoute";

const AdminDashboardPage = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <AdminDashboard />
        </main>
      </div>
    </AdminRoute>
  );
};

export default AdminDashboardPage;
