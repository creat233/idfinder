
import { Header } from "@/components/Header";
import { AdminPromoActivation } from "@/components/promo/AdminPromoActivation";
import { AdminPromoCodesList } from "@/components/promo/AdminPromoCodesList";
import { AdminRecoveriesList } from "@/components/promo/AdminRecoveriesList";
import { AdminPendingCodes } from "@/components/promo/AdminPendingCodes";
import { AdminAllRecoveries } from "@/components/promo/AdminAllRecoveries";
import { AdminRecoveredCards } from "@/components/promo/AdminRecoveredCards";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Shield, Activity } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminAdsManager } from "@/components/promo/AdminAdsManager";
import { AdminRevenueDashboard } from "@/components/promo/AdminRevenueDashboard";
import { AdminBulkEmailSender } from "@/components/promo/AdminBulkEmailSender";
import { AdminSingleEmailSender } from "@/components/promo/AdminSingleEmailSender";
import { AdminUsersList } from "@/components/promo/AdminUsersList";
import { AdminAnalyticsDashboard } from "@/components/promo/AdminAnalyticsDashboard";
import { AdminAuditLogsList } from "@/components/promo/AdminAuditLogsList";
import { AdminSettings } from "@/components/promo/AdminSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";

const AdminPromoCodes = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ConnectionStatus />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* En-tête avec informations importantes */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-8 w-8 text-orange-600" />
              <h1 className="text-3xl font-bold text-orange-800">{t("admin_title")}</h1>
            </div>
            <p className="text-muted-foreground">{t("admin_subtitle")}</p>
            
            <Alert className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{t("admin_secure_zone")}</strong> - {t("admin_secure_zone_desc")}
              </AlertDescription>
            </Alert>
          </div>

          {/* Statut du système */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Activity className="h-5 w-5" />
                {t("system_status")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <p className="text-sm text-green-700">{t("db_status")}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <p className="text-sm text-green-700">{t("rpc_status")}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <p className="text-sm text-green-700">{t("realtime_status")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="codes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="codes">{t("tabs_codes")}</TabsTrigger>
              <TabsTrigger value="users">{t("tabs_users")}</TabsTrigger>
              <TabsTrigger value="marketing">{t("tabs_marketing")}</TabsTrigger>
              <TabsTrigger value="analytics">{t("tabs_analytics")}</TabsTrigger>
              <TabsTrigger value="settings">{t("tabs_settings")}</TabsTrigger>
            </TabsList>

            <TabsContent value="codes" className="mt-6 space-y-6">
              <AdminPendingCodes />
              <AdminPromoActivation />
              <AdminPromoCodesList />
              <AdminAllRecoveries />
              <AdminRecoveredCards />
              <AdminRecoveriesList />
            </TabsContent>

            <TabsContent value="users" className="mt-6 space-y-6">
              <AdminUsersList />
              <AdminBulkEmailSender />
              <AdminSingleEmailSender />
            </TabsContent>

            <TabsContent value="marketing" className="mt-6 space-y-6">
               <AdminAdsManager />
               <AdminRevenueDashboard />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6 space-y-6">
              <AdminAnalyticsDashboard />
              <AdminAuditLogsList />
            </TabsContent>

            <TabsContent value="settings" className="mt-6 space-y-6">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminPromoCodes;
