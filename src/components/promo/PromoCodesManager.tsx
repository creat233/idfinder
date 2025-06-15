
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Share2, TrendingUp, Users } from "lucide-react";
import { usePromoCodes } from "@/hooks/usePromoCodes";
import { PromoCodesList } from "./PromoCodesList";
import { useTranslation } from "@/hooks/useTranslation";

export const PromoCodesManager = () => {
  const { promoCodes, loading, createPromoCode } = usePromoCodes();
  const { t } = useTranslation();

  const handleGenerateCode = async () => {
    await createPromoCode();
  };

  const activeCodes = promoCodes.filter(code => code.is_active);
  const totalEarnings = promoCodes.reduce((sum, code) => sum + code.total_earnings, 0);
  const totalUsage = promoCodes.reduce((sum, code) => sum + code.usage_count, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("promoCodes")}
        </h1>
        <p className="text-gray-600">
          {t("promo_manager_title")}
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{totalEarnings} FCFA</p>
                <p className="text-sm text-gray-600">{t("total_revenue")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalUsage}</p>
                <p className="text-sm text-gray-600">{t("total_usages")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Share2 className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{activeCodes.length}</p>
                <p className="text-sm text-gray-600">{t("active_codes")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conseils de partage */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Share2 className="h-5 w-5" />
            {t("tips_title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-purple-800 mb-1">{t("tip_social_title")}</h4>
              <p className="text-purple-700">{t("tip_social_desc")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-1">{t("tip_relatives_title")}</h4>
              <p className="text-purple-700">{t("tip_relatives_desc")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-1">{t("tip_earn_title")}</h4>
              <p className="text-purple-700">{t("tip_earn_desc")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-1">{t("tip_validity_title")}</h4>
              <p className="text-purple-700">{t("tip_validity_desc")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Génération de code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t("buyPromoCode")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">{t("how_it_works_title")}</h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>{t("how_it_works_step1")}</li>
              <li>{t("how_it_works_step2")}</li>
              <li>{t("how_it_works_step3")}</li>
              <li>{t("how_it_works_step4")}</li>
              <li>{t("how_it_works_step5")}</li>
            </ol>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              {t("promoCodePrice")}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {t("investment_info")}
            </p>
            <Button 
              onClick={handleGenerateCode}
              disabled={loading}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="mr-2 h-5 w-5" />
              {loading ? t("generating_code") : t("generateCode")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des codes */}
      <Card>
        <CardHeader>
          <CardTitle>{t("myPromoCodes")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">{t("loading")}</p>
            </div>
          ) : (
            <PromoCodesList promoCodes={promoCodes} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
