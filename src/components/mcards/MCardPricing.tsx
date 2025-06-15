
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getPriceInfoForCountry } from "@/utils/pricing";
import { Button } from "@/components/ui/button";

export const MCardPricing = () => {
  const { t } = useTranslation();
  // For now, we'll display pricing for Senegal as it's the primary target.
  const priceInfo = getPriceInfoForCountry('SN');
  const mCardPrice = 5000;

  return (
    <section className="py-16 bg-muted/40 rounded-lg">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center mb-4">{t('mCardPricingTitle')}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl">{t('mCardPriceDescription')}</p>
        <Card className="w-full max-w-sm text-center shadow-lg border-primary border-t-4">
          <CardHeader>
            <CardTitle className="text-2xl">{t('annualSubscription')}</CardTitle>
            <CardDescription>FinderID mCard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="my-4">
              <span className="text-5xl font-bold">{new Intl.NumberFormat().format(mCardPrice)}</span>
              <span className="text-xl font-medium text-muted-foreground ml-1">{priceInfo.currency}</span>
              <span className="text-muted-foreground">{t('perYear')}</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Toutes les fonctionnalités incluses.
            </p>
            <Button size="lg" className="w-full" disabled>
              {t('createMCard')}
            </Button>
             <p className="text-xs text-muted-foreground mt-2">Créez une carte pour commencer. Le paiement se fait après.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
