
import { Header } from "@/components/Header";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { useNotifications } from "@/hooks/useNotifications";
import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

const Notifications = () => {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: adminStatus } = await supabase.rpc('is_admin');
      setIsAdmin(adminStatus || false);
    };
    checkAdminStatus();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold mb-6">{t("notifications") || "Notifications"}</h1>
          
          {isAdmin && (
            <Alert className="border-orange-200 bg-orange-50">
              <Shield className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Mode Administrateur :</strong> Vous recevez les notifications importantes de tout le système en plus de vos notifications personnelles.
              </AlertDescription>
            </Alert>
          )}

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
        </div>
      </main>
    </div>
  );
};

export default Notifications;
