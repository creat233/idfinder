
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getPriceInfoForCountry } from "@/utils/pricing";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const MCardPricing = () => {
  const { t } = useTranslation();
  // For now, we'll display pricing for Senegal as it's the primary target.
  const priceInfo = getPriceInfoForCountry('SN');

  const plans = [
    {
      name: t('planEssential'),
      price: 2000,
      monthlyPrice: 200,
      description: t('planEssentialDescription'),
      features: [
        t('mCardFeature1Title'), // Partage Facile
        t('mCardFeature4Title'), // Écologique
      ],
      isPopular: false,
    },
    {
      name: t('planPremium'),
      price: 5000,
      monthlyPrice: 500,
      description: t('planPremiumDescription'),
      features: [
        t('mCardFeature1Title'), // Partage Facile
        t('mCardFeature2Title'), // Toujours à Jour
        t('mCardFeature3Title'), // Image Professionnelle
        t('mCardFeature4Title'), // Écologique
      ],
      isPopular: true,
    },
  ];

  return (
    <section className="py-16 bg-muted/40 rounded-lg">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center mb-4">{t('mCardPricingTitle')}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl">{t('mCardPriceDescription')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {plans.map((plan, index) => (
            <Card key={index} className={cn("flex flex-col", plan.isPopular && "border-primary border-2 relative")}>
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">
                  {t('mostPopular')}
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="my-4 text-center">
                  <span className="text-5xl font-bold">{new Intl.NumberFormat().format(plan.price)}</span>
                  <span className="text-xl font-medium text-muted-foreground ml-1">{priceInfo.currency}</span>
                  <span className="text-muted-foreground">{t('perYear')}</span>
                  <p className="text-muted-foreground text-sm mt-1">
                    soit {new Intl.NumberFormat().format(plan.monthlyPrice)} {priceInfo.currency}{t('perMonth')}
                  </p>
                </div>
                
                <div className="space-y-3 flex-grow">
                  <h4 className="font-semibold">{t('includedFeatures')}</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full mt-6">
                      <Button size="lg" className="w-full" disabled variant={plan.isPopular ? 'default' : 'outline'}>
                        {t('selectPlan')}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('selectPlanTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
                 <p className="text-xs text-muted-foreground mt-2 text-center">Créez une carte pour commencer. Le paiement se fait après.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
