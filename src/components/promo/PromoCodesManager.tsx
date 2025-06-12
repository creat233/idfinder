
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Gift, Clock, MessageCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePromoCodes } from "@/hooks/usePromoCodes";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { PromoCodesList } from "./PromoCodesList";
import { AdminPromoActivation } from "./AdminPromoActivation";

export const PromoCodesManager = () => {
  const { t } = useTranslation();
  const { promoCodes, loading, generatePromoCode } = usePromoCodes();
  const { hasActivationPermission, loading: permissionsLoading } = useAdminPermissions();
  const [generating, setGenerating] = useState(false);

  const handleGenerateCode = async () => {
    setGenerating(true);
    await generatePromoCode();
    setGenerating(false);
  };

  if (loading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{t("promoCodes")}</h1>
        <p className="text-muted-foreground">{t("promoCodeBenefits")}</p>
      </div>

      {/* Section d'administration pour les utilisateurs autorisés */}
      {hasActivationPermission && (
        <AdminPromoActivation />
      )}

      <Tabs defaultValue="my-codes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-codes">{t("myPromoCodes")}</TabsTrigger>
          <TabsTrigger value="buy-new">{t("buyPromoCode")}</TabsTrigger>
        </TabsList>

        <TabsContent value="my-codes" className="space-y-4">
          <PromoCodesList promoCodes={promoCodes} />
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
                <p className="text-muted-foreground">
                  {t("promoCodeBenefits")}
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <strong className="text-blue-800">Processus de validation :</strong>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">
                    Après avoir généré votre code, il sera envoyé à l'administration pour validation. 
                    Une fois validé par l'équipe, votre code sera automatiquement activé et vous pourrez commencer à l'utiliser.
                  </p>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">
                      📱 Notification WhatsApp automatique envoyée après génération
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">🎯 Avantages de votre code promo :</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Réduction de 1000 FCFA par utilisation</li>
                    <li>• Gains automatiques à chaque utilisation</li>
                    <li>• Suivi en temps réel de vos revenus</li>
                    <li>• Notifications WhatsApp pour chaque activation</li>
                  </ul>
                </div>

                <Button
                  onClick={handleGenerateCode}
                  disabled={generating}
                  className="w-full"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {generating ? t("loading") : t("generateCode")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
