import { Header } from "@/components/Header";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { AdminRoute } from "@/components/AdminRoute";

const AdminAnalyticsPage = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <AdminAnalytics />
        </main>
      </div>
    </AdminRoute>
  );
};

export default AdminAnalyticsPage;