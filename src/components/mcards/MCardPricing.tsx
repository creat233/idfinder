
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getPriceInfoForCountry } from "@/utils/pricing";
import { Button } from "@/components/ui/button";
import { Check, Gift, Zap, Crown, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MCard } from "@/types/mcard";
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
      name: 'Gratuit',
      price: 0,
      monthlyPrice: 0,
      description: 'Parfait pour commencer',
      features: [
        'Carte de visite digitale',
        'Partage illimité par QR code',
        'Photo de profil',
        'Informations de contact de base',
        'Hébergement gratuit à vie'
      ],
      isPopular: false,
      icon: <Gift className="h-6 w-6" />,
      gradient: 'from-gray-100 to-gray-200',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
      badge: null
    },
    {
      id: 'essential',
      name: 'Essentiel',
      price: 2000,
      monthlyPrice: 2000,
      description: 'Pour les professionnels actifs',
      features: [
        'Tout du plan Gratuit',
        'Réseaux sociaux professionnels',
        'Statistiques de consultation',
        'Mise à jour en temps réel',
        'Support par email'
      ],
      isPopular: true,
      icon: <Zap className="h-6 w-6" />,
      gradient: 'from-blue-100 to-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      period: 'mois',
      badge: 'POPULAIRE'
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
        'Catalogue produits/services',
        'Analytics avancées',
        'Support prioritaire',
        'Personnalisation avancée'
      ],
      isPopular: false,
      icon: <Crown className="h-6 w-6" />,
      gradient: 'from-purple-100 to-purple-200',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      period: 'an',
      badge: 'COMPLET'
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
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">
                Choisissez Votre Plan
              </h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                Créez votre carte de visite digitale professionnelle et ne perdez plus jamais un contact
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={cn(
                    "relative flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2",
                    plan.isPopular ? "border-yellow-400 shadow-yellow-400/20 shadow-xl scale-105" : "border-gray-200 hover:border-blue-300",
                    upgradingCardId && "ring-2 ring-offset-2 ring-blue-500/50"
                  )}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  <CardHeader className={`text-center bg-gradient-to-br ${plan.gradient} rounded-t-lg`}>
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-white rounded-full shadow-lg">
                        {plan.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600 font-medium">{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow p-8">
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-bold text-gray-900">
                          {new Intl.NumberFormat().format(plan.price)}
                        </span>
                        <span className="text-xl font-medium text-gray-600">{priceInfo.currency}</span>
                      </div>
                      {plan.period && (
                        <p className="text-gray-500 mt-2">
                          /{plan.period}
                          {plan.period === 'an' && plan.monthlyPrice > 0 && (
                            <span className="block text-sm mt-1">
                              soit {new Intl.NumberFormat().format(plan.monthlyPrice)} {priceInfo.currency}/mois
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-4 flex-grow mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      size="lg" 
                      className={cn(
                        "w-full text-white font-semibold py-4 transition-all duration-300 group",
                        plan.buttonColor,
                        plan.isPopular && "shadow-lg hover:shadow-xl"
                      )}
                      disabled={upgradingCardId && plan.id === 'free'}
                      onClick={() => handleSelectPlan(plan.id as 'free' | 'essential' | 'premium')}
                    >
                      {upgradingCardId && plan.id !== 'free' ? (
                        <>
                          Passer au plan {plan.name}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      ) : (
                        <>
                          {plan.id === 'free' ? 'Commencer gratuitement' : `Choisir ${plan.name}`}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                      {plan.id === 'free' 
                        ? 'Aucun engagement, gratuit à vie' 
                        : 'Paiement sécurisé • Activation immédiate après confirmation'
                      }
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white">
                <Check className="h-5 w-5 text-green-400" />
                <span>Hébergement gratuit • Mises à jour automatiques • Support inclus</span>
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
