
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Gift, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePromoCodes } from "@/hooks/usePromoCodes";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { AdminPromoActivation } from "./AdminPromoActivation";
import { useToast } from "@/hooks/useToast";
import { ConnectionStatus } from "@/components/ConnectionStatus";

export const PromoCodesManager = () => {
  const { t } = useTranslation();
  const { promoCodes, loading, generatePromoCode } = usePromoCodes();
  const { hasActivationPermission, loading: permissionsLoading } = useAdminPermissions();
  const [generating, setGenerating] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleGenerateCode = async () => {
    setGenerating(true);
    const result = await generatePromoCode();
    setGenerating(false);
    
    if (result) {
      showSuccess(
        "Code généré", 
        `Votre code ${result} a été créé et apparaît maintenant sur la page d'administration pour validation.`
      );
    }
  };

  if (loading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusIcon = (code: any) => {
    if (code.is_active) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (code.is_paid) return <Clock className="h-4 w-4 text-blue-600" />;
    return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  };

  const getStatusText = (code: any) => {
    if (code.is_active) return "Actif";
    if (code.is_paid) return "Payé";
    return "En attente";
  };

  const getStatusBadgeClass = (code: any) => {
    if (code.is_active) return "bg-green-100 text-green-800";
    if (code.is_paid) return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="space-y-6">
      <ConnectionStatus />
      
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{t("promoCodes")}</h1>
        <p className="text-muted-foreground">{t("promoCodeBenefits")}</p>
      </div>

      {hasActivationPermission && <AdminPromoActivation />}

      <Tabs defaultValue="my-codes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-codes">{t("myPromoCodes")}</TabsTrigger>
          <TabsTrigger value="buy-new">{t("buyPromoCode")}</TabsTrigger>
        </TabsList>

        <TabsContent value="my-codes" className="space-y-4">
          <div className="space-y-4">
            {promoCodes.map((code) => (
              <Card key={code.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-primary" />
                        <span className="font-mono font-bold text-lg">{code.code}</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(code)}
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(code)}`}>
                            {getStatusText(code)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground grid grid-cols-3 gap-4">
                        <div>Créé: {new Date(code.created_at).toLocaleDateString('fr-FR')}</div>
                        <div>Utilisations: {code.usage_count}</div>
                        <div>Gains: {code.total_earnings} FCFA</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {promoCodes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun code promo généré</p>
                <p className="text-sm">Créez votre premier code pour commencer à gagner!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="buy-new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                {t("buyPromoCode")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-primary">1000 FCFA</div>
                <p className="text-muted-foreground">{t("promoCodeBenefits")}</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <strong className="text-blue-800">Processus automatisé :</strong>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">
                    Votre code apparaîtra automatiquement sur la page d'administration pour validation rapide.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">🎯 Avantages :</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 1000 FCFA de réduction par utilisation</li>
                    <li>• Revenus automatiques à chaque usage</li>
                    <li>• Suivi en temps réel</li>
                    <li>• Validation administrative rapide</li>
                  </ul>
                </div>

                <Button
                  onClick={handleGenerateCode}
                  disabled={generating}
                  className="w-full"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {generating ? "Génération..." : t("generateCode")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
