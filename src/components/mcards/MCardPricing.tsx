
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getPriceInfoForCountry } from "@/utils/pricing";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MCard } from "@/types/mcard";
import { SelectMCardDialog } from "./SelectMCardDialog";

interface MCardPricingProps {
  mcards: MCard[];
  onRequestUpgrade: (mcardId: string, plan: 'essential' | 'premium') => void;
  onStartCreationFlow: (plan: 'essential' | 'premium') => void;
  upgradingCardId?: string | null;
}

export const MCardPricing = ({ mcards, onRequestUpgrade, onStartCreationFlow, upgradingCardId }: MCardPricingProps) => {
  const { t } = useTranslation();
  const priceInfo = getPriceInfoForCountry('SN');
  const [isSelectCardDialogOpen, setIsSelectCardDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'essential' | 'premium' | null>(null);

  const plans = [
    {
      id: 'essential',
      name: 'Essentiel',
      price: 2000,
      monthlyPrice: 2000,
      description: 'Pour les professionnels actifs',
      features: [
        'Carte de visite digitale complète',
        'Réseaux sociaux professionnels',
        'Statistiques de consultation détaillées',
        'Mise à jour en temps réel',
        'Support par email prioritaire',
        'Partage illimité via QR code et lien'
      ],
      isPopular: true,
      icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6" />,
      gradient: 'from-blue-100 to-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      period: 'mois',
      badge: 'POPULAIRE',
      paymentInfo: 'Activation sous 24h après paiement'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 10000,
      monthlyPrice: 833,
      description: 'Solution complète pour entrepreneurs',
      features: [
        'Tout du plan Essentiel',
        'Statuts personnalisés en temps réel',
        'Catalogue produits/services intégré',
        'Analytics avancées et exports',
        'Support prioritaire 24/7',
        'Personnalisation avancée (couleurs, thèmes)',
        'Intégrations CRM et outils pro'
      ],
      isPopular: false,
      icon: <Crown className="h-5 w-5 sm:h-6 sm:w-6" />,
      gradient: 'from-purple-100 to-purple-200',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      period: 'an',
      badge: 'COMPLET',
      paymentInfo: 'Économisez 2 mois avec le paiement annuel'
    },
  ];

  const handleSelectPlan = (planId: 'essential' | 'premium') => {
    if (upgradingCardId) {
      onRequestUpgrade(upgradingCardId, planId);
    } else if (mcards.length >= 1) {
      if (mcards.length > 1) {
        setSelectedPlan(planId);
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
        <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 sm:mb-6">
                Plans Professionnels
              </h2>
              <p className="text-lg sm:text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                Choisissez le plan qui correspond à vos besoins professionnels
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={cn(
                    "relative flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2",
                    plan.isPopular ? "border-yellow-400 shadow-yellow-400/20 shadow-xl md:scale-105" : "border-gray-200 hover:border-blue-300",
                    upgradingCardId && "ring-2 ring-offset-2 ring-blue-500/50"
                  )}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  <CardHeader className={`text-center bg-gradient-to-br ${plan.gradient} rounded-t-lg p-4 sm:p-6`}>
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                      <div className="p-2 sm:p-3 bg-white rounded-full shadow-lg">
                        {plan.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600 font-medium text-sm sm:text-base">{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow p-4 sm:p-6 lg:p-8">
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                          {new Intl.NumberFormat().format(plan.price)}
                        </span>
                        <span className="text-lg sm:text-xl font-medium text-gray-600">{priceInfo.currency}</span>
                      </div>
                      <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        /{plan.period}
                        {plan.period === 'an' && plan.monthlyPrice > 0 && (
                          <span className="block text-xs sm:text-sm mt-1">
                            soit {new Intl.NumberFormat().format(plan.monthlyPrice)} {priceInfo.currency}/mois
                          </span>
                        )}
                      </p>
                      <p className="text-blue-600 text-xs sm:text-sm mt-2 font-medium">
                        {plan.paymentInfo}
                      </p>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4 flex-grow mb-6 sm:mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      size="lg" 
                      className={cn(
                        "w-full text-white font-semibold py-3 sm:py-4 transition-all duration-300 group text-sm sm:text-base",
                        plan.buttonColor,
                        plan.isPopular && "shadow-lg hover:shadow-xl"
                      )}
                      onClick={() => handleSelectPlan(plan.id as 'essential' | 'premium')}
                    >
                      {upgradingCardId ? (
                        <>
                          Passer au plan {plan.name}
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      ) : (
                        <>
                          Choisir {plan.name}
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 mt-3 sm:mt-4 text-center leading-relaxed">
                      Paiement sécurisé • Activation après confirmation • Support inclus
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 sm:mt-16 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-3 text-white">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  <span className="text-sm sm:text-base">Hébergement gratuit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  <span className="text-sm sm:text-base">Mises à jour automatiques</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  <span className="text-sm sm:text-base">Support inclus</span>
                </div>
              </div>
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
