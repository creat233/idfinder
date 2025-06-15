
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

const AdminPromoCodes = () => {
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
              <h1 className="text-3xl font-bold text-orange-800">Administration FinderID</h1>
            </div>
            <p className="text-muted-foreground">Interface d'administration des codes promo et récupérations</p>
            
            <Alert className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Zone d'administration sécurisée</strong> - Accès restreint aux administrateurs autorisés. 
                Toutes les actions sont enregistrées et tracées.
              </AlertDescription>
            </Alert>
          </div>

          {/* Statut du système */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Activity className="h-5 w-5" />
                Statut du Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <p className="text-sm text-green-700">Base de données</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <p className="text-sm text-green-700">Fonctions RPC</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <p className="text-sm text-green-700">Temps réel</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Module : Statistiques des revenus */}
          <AdminRevenueDashboard />
          
          {/* Module : gestion pubs entreprises */}
          <AdminAdsManager />

          {/* Module : Envoi d'e-mails en masse */}
          <AdminBulkEmailSender />
          
          {/* Sections principales */}
          <AdminPendingCodes />
          <AdminAllRecoveries />
          <AdminRecoveredCards />
          <AdminPromoActivation />
          <AdminRecoveriesList />
          <AdminPromoCodesList />
        </div>
      </main>
    </div>
  );
};

export default AdminPromoCodes;
