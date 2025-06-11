
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Gift } from "lucide-react";
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
                  <p className="text-sm text-blue-800">
                    {t("paymentInstructions")}
                  </p>
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
