import { Header } from "@/components/Header";
import { AdminLegalManagement } from "@/components/admin/AdminLegalManagement";
import { AdminRoute } from "@/components/AdminRoute";

const AdminLegal = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <AdminLegalManagement />
        </main>
      </div>
    </AdminRoute>
  );
};

export default AdminLegal;