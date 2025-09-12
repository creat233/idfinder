
import { Header } from "@/components/Header";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { useNotifications } from "@/hooks/useNotifications";
import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";

const Notifications = () => {
  const { notifications, loading } = useNotifications();
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuthState();
  const navigate = useNavigate();

  // Rediriger vers la page de connexion si non authentifié
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isAuthenticated) {
        const { data: adminStatus } = await supabase.rpc('is_admin');
        setIsAdmin(adminStatus || false);
      }
    };
    checkAdminStatus();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
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

          <Alert className="border-blue-200 bg-blue-50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Gestion automatique :</strong> Les notifications sont automatiquement supprimées après 24 heures pour garder votre liste propre.
            </AlertDescription>
          </Alert>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">{t("loading") || "Chargement..."}</p>
            </div>
          ) : (
            <NotificationsList />
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
