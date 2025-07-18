
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PromoCodeData } from "@/types/promo";
import { PromoCodeActivation } from "./PromoCodeActivation";
import { PromoCodeShareButtons } from "./PromoCodeShareButtons";

interface PromoCodeCardProps {
  promoCode: PromoCodeData & { 
    isExpired?: boolean; 
    daysUntilExpiration?: number; 
  };
}

export const PromoCodeCard = ({ promoCode }: PromoCodeCardProps) => {
  const { t } = useTranslation();
  const now = new Date();
  const expiresAt = new Date(promoCode.expires_at);
  const isExpired = expiresAt < now;
  const daysUntilExpiration = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={isExpired ? "border-red-200 bg-red-50" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-mono text-lg">{promoCode.code}</span>
          <div className="flex gap-2">
            {isExpired ? (
              <Badge variant="destructive" className="bg-red-100 text-red-800">
                ⏰ Expiré
              </Badge>
            ) : promoCode.is_active ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                {t("codeActive")}
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {t("codeNotActive")}
              </Badge>
            )}
            {!isExpired && daysUntilExpiration <= 7 && daysUntilExpiration > 0 && (
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                Expire dans {daysUntilExpiration}j
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">{t("totalEarnings")}:</span>
            <span className="ml-2 text-green-600 font-semibold">{promoCode.total_earnings} FCFA</span>
          </div>
          <div>
            <span className="font-medium">{t("usageCount")}:</span>
            <span className="ml-2 font-semibold">{promoCode.usage_count}</span>
          </div>
          <div className="col-span-2">
            <span className="font-medium">{t("expiresOn")}:</span>
            <span className={`ml-2 ${isExpired ? 'text-red-600 font-semibold' : ''}`}>
              {format(new Date(promoCode.expires_at), "dd/MM/yyyy", { locale: fr })}
              {isExpired && <span className="text-red-500 ml-2">• EXPIRÉ</span>}
            </span>
          </div>
        </div>

        {isExpired ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium">
              ⏰ Ce code promo a expiré le {format(expiresAt, "dd/MM/yyyy", { locale: fr })}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Les codes expirés ne peuvent plus être utilisés. Créez un nouveau code promo pour continuer à gagner des commissions.
            </p>
          </div>
        ) : !promoCode.is_active ? (
          <PromoCodeActivation promoCode={promoCode.code} />
        ) : (
          <PromoCodeShareButtons code={promoCode.code} />
        )}

        {promoCode.is_active && promoCode.usage_count > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>{t("revenue_generated_title")}</strong> {promoCode.total_earnings} FCFA
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {t("revenue_generated_desc")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
