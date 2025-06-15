import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getPriceInfoForCountry } from "@/utils/pricing";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MCard } from "@/hooks/useMCards";
import { SelectMCardDialog } from "./SelectMCardDialog";

interface MCardPricingProps {
  mcards: MCard[];
  onRequestUpgrade: (mcardId: string, plan: 'essential' | 'premium') => void;
  onStartCreationFlow: (plan: 'free' | 'essential' | 'premium') => void;
  upgradingCardId?: string | null;
}

export const MCardPricing = ({ mcards, onRequestUpgrade, onStartCreationFlow, upgradingCardId }: MCardPricingProps) => {
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

  const handleSelectPlan = (planId: 'free' | 'essential' | 'premium') => {
    if (upgradingCardId) {
      if (planId !== 'free') {
        onRequestUpgrade(upgradingCardId, planId as 'essential' | 'premium');
      }
    } else if (mcards.length >= 1 && planId !== 'free') {
      if (mcards.length > 1) {
        setSelectedPlan(planId as 'essential' | 'premium');
        setIsSelectCardDialogOpen(true);
      } else {
        onStartCreationFlow(planId);
      }
    } else {
      onStartCreationFlow(planId);
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
      <div>
        <section className="py-16 bg-muted/40 rounded-lg">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center mb-4">{t('mCardPricingTitle')}</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl">{t('mCardPriceDescription')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
              {plans.map((plan, index) => (
                <Card key={index} className={cn("flex flex-col", plan.isPopular && "border-primary border-2 relative", upgradingCardId && "ring-2 ring-offset-2 ring-primary/50 transition-all duration-300")}>
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
                    
                    <div className="w-full mt-6">
                      <Button 
                        size="lg" 
                        className="w-full"
                        disabled={upgradingCardId && plan.id === 'free'}
                        variant={plan.isPopular ? 'default' : 'outline'}
                        onClick={() => handleSelectPlan(plan.id as 'free' | 'essential' | 'premium')}
                      >
                        {upgradingCardId && plan.id !== 'free' ? t('upgradeNow') : (plan.id === 'free' ? t('createForFree') : t('selectPlan'))}
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      {plan.id !== 'free' ? 'Le paiement se fait après la sélection.' : ' '}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
      <SelectMCardDialog 
        isOpen={isSelectCardDialogOpen}
        onOpenChange={setIsSelectCardDialogOpen}
        mcards={mcards}
        onSelect={handleCardSelectedForUpgrade}
      />
    </>
  );
};
