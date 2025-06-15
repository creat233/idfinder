
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getPriceInfoForCountry } from "@/utils/pricing";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MCard } from "@/hooks/useMCards";
import { SelectMCardDialog } from "./SelectMCardDialog";

interface MCardPricingProps {
  mcards: MCard[];
  onRequestUpgrade: (mcardId: string, plan: 'essential' | 'premium') => void;
}

export const MCardPricing = ({ mcards, onRequestUpgrade }: MCardPricingProps) => {
  const { t } = useTranslation();
  const priceInfo = getPriceInfoForCountry('SN');
  const [isSelectCardDialogOpen, setIsSelectCardDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'essential' | 'premium' | null>(null);

  const plans = [
    {
      id: 'free',
      name: t('planFree'),
      price: 0,
      monthlyPrice: 0,
      description: t('planFreeDescription'),
      features: [
        t('mCardFeature1Title'), // Partage Facile
      ],
      isPopular: false,
    },
    {
      id: 'essential',
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
      id: 'premium',
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

  const handleSelectPlan = (planId: 'essential' | 'premium') => {
    if (mcards.length === 1) {
      onRequestUpgrade(mcards[0].id, planId);
    } else if (mcards.length > 1) {
      setSelectedPlan(planId);
      setIsSelectCardDialogOpen(true);
    }
  };

  const handleCardSelectedForUpgrade = (mcardId: string) => {
    if (selectedPlan) {
      onRequestUpgrade(mcardId, selectedPlan);
    }
    setIsSelectCardDialogOpen(false);
    setSelectedPlan(null);
  };

  return (
    <>
      <section className="py-16 bg-muted/40 rounded-lg">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-4">{t('mCardPricingTitle')}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl">{t('mCardPriceDescription')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
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
                    {plan.price > 0 && <span className="text-muted-foreground">{t('perYear')}</span>}
                    {plan.monthlyPrice > 0 && (
                      <p className="text-muted-foreground text-sm mt-1">
                        soit {new Intl.NumberFormat().format(plan.monthlyPrice)} {priceInfo.currency}{t('perMonth')}
                      </p>
                    )}
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
                  
                  {plan.id !== 'free' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full mt-6">
                          <Button 
                            size="lg" 
                            className="w-full" 
                            disabled={mcards.length === 0} 
                            variant={plan.isPopular ? 'default' : 'outline'}
                            onClick={() => handleSelectPlan(plan.id as 'essential' | 'premium')}
                          >
                            {t('selectPlan')}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {mcards.length === 0 && (
                        <TooltipContent>
                          <p>{t('selectPlanTooltip')}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ) : (
                    <div className="w-full mt-6 h-11" />
                  )}

                   <p className="text-xs text-muted-foreground mt-2 text-center">
                    {plan.id !== 'free' ? 'Le paiement se fait après la sélection.' : ' '}
                   </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <SelectMCardDialog 
        isOpen={isSelectCardDialogOpen}
        onOpenChange={setIsSelectCardDialogOpen}
        mcards={mcards}
        onSelect={handleCardSelectedForUpgrade}
      />
    </>
  );
};
