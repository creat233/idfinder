
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/providers/TranslationProvider";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PromoCodeData } from "@/types/promo";
import { PromoCodeActivation } from "./PromoCodeActivation";
import { PromoCodeShareButtons } from "./PromoCodeShareButtons";

interface PromoCodeCardProps {
  promoCode: PromoCodeData;
}

export const PromoCodeCard = ({ promoCode }: PromoCodeCardProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-mono text-lg">{promoCode.code}</span>
          <div className="flex gap-2">
            {promoCode.is_active ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                {t("codeActive")}
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {t("codeNotActive")}
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
            <span className="ml-2">
              {format(new Date(promoCode.expires_at), "dd/MM/yyyy", { locale: fr })}
            </span>
          </div>
        </div>

        {!promoCode.is_active ? (
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
