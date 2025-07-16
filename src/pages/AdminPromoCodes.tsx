
import { AdminRoute } from "@/components/AdminRoute";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPromoCodesList } from "@/components/promo/AdminPromoCodesList";
import { AdminPendingCodes } from "@/components/promo/AdminPendingCodes";
import { AdminPendingMCards } from "@/components/promo/AdminPendingMCards";
import { AdminMCardRenewals } from "@/components/promo/AdminMCardRenewals";
import { AdminAllRecoveries } from "@/components/promo/AdminAllRecoveries";
import { AdminUsersList } from "@/components/promo/AdminUsersList";
import { AdminRevenueDashboard } from "@/components/promo/AdminRevenueDashboard";
import { AdminAnalyticsDashboard } from "@/components/promo/AdminAnalyticsDashboard";
import { AdminAuditLogsList } from "@/components/promo/AdminAuditLogsList";
import { AdminExtendedAuditLogs } from "@/components/promo/AdminExtendedAuditLogs";
import { AdminSettings } from "@/components/promo/AdminSettings";
import { AdminAdsManager } from "@/components/promo/AdminAdsManager";
import { AdminBulkEmailSender } from "@/components/promo/AdminBulkEmailSender";
import { AdminSingleEmailSender } from "@/components/promo/AdminSingleEmailSender";
import { AdminEmailSettings } from "@/components/promo/AdminEmailSettings";
import { InfluencerEmailTemplate } from "@/components/admin/InfluencerEmailTemplate";
import { SystemStatusChecker } from "@/components/admin/SystemStatusChecker";
import { AdminMCardVerifications } from "@/components/promo/AdminMCardVerifications";

const AdminPromoCodes = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Administration FinderID
          </h1>
          
          <Tabs defaultValue="status" className="w-full">
            <TabsList className="grid w-full grid-cols-6 lg:grid-cols-14 mb-8">
              <TabsTrigger value="status">Statut</TabsTrigger>
              <TabsTrigger value="mcards">mCards</TabsTrigger>
              <TabsTrigger value="verifications">Vérifications</TabsTrigger>
              <TabsTrigger value="renewals">Renouvellements</TabsTrigger>
              <TabsTrigger value="codes-promo">Codes</TabsTrigger>
              <TabsTrigger value="recuperations">Récupérations</TabsTrigger>
              <TabsTrigger value="revenus">Revenus</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
              <TabsTrigger value="emails">Emails</TabsTrigger>
              <TabsTrigger value="email-config">Config Email</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
              <TabsTrigger value="publicites">Publicités</TabsTrigger>
              <TabsTrigger value="parametres">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="status">
              <SystemStatusChecker />
            </TabsContent>

            <TabsContent value="mcards">
              <AdminPendingMCards />
            </TabsContent>

            <TabsContent value="verifications">
              <AdminMCardVerifications />
            </TabsContent>

            <TabsContent value="renewals">
              <AdminMCardRenewals />
            </TabsContent>

            <TabsContent value="codes-promo">
              <div className="space-y-8">
                <AdminPendingCodes />
                <AdminPromoCodesList />
              </div>
            </TabsContent>

            <TabsContent value="recuperations">
              <AdminAllRecoveries />
            </TabsContent>

            <TabsContent value="revenus">
              <AdminRevenueDashboard />
            </TabsContent>

            <TabsContent value="analytics">
              <AdminAnalyticsDashboard />
            </TabsContent>

            <TabsContent value="utilisateurs">
              <AdminUsersList />
            </TabsContent>

            <TabsContent value="emails">
              <div className="space-y-8">
                <AdminBulkEmailSender />
                <AdminSingleEmailSender />
                <InfluencerEmailTemplate />
              </div>
            </TabsContent>

            <TabsContent value="email-config">
              <AdminEmailSettings />
            </TabsContent>

            <TabsContent value="audit">
              <AdminExtendedAuditLogs />
            </TabsContent>

            <TabsContent value="publicites">
              <AdminAdsManager />
            </TabsContent>

            <TabsContent value="parametres">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminRoute>
  );
};

export default AdminPromoCodes;
