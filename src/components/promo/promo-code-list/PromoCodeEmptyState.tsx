
import { useTranslation } from "@/providers/TranslationProvider";

export const PromoCodeEmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-semibold mb-2">{t("noPromoCodes")}</h3>
      <p className="text-muted-foreground mb-4">{t("createFirstCode")}</p>
      <p className="text-sm text-muted-foreground">{t("promoCodeBenefits")}</p>
    </div>
  );
};
