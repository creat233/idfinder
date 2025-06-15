
import { Header } from "@/components/Header";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { useNotifications } from "@/hooks/useNotifications";
import { useTranslation } from "@/hooks/useTranslation";

const Notifications = () => {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">{t("notifications") || "Notifications"}</h1>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">{t("loading") || "Chargement..."}</p>
          </div>
        ) : (
          <NotificationsList
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
          />
        )}
      </main>
    </div>
  );
};
export default Notifications;
