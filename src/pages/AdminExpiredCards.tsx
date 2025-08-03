import { Header } from "@/components/Header";
import { AdminExpiredCards } from "@/components/admin/AdminExpiredCards";
import { AdminRoute } from "@/components/AdminRoute";

const AdminExpiredCardsPage = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <AdminExpiredCards />
        </main>
      </div>
    </AdminRoute>
  );
};

export default AdminExpiredCardsPage;