
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPriceInfoForCountry } from "@/utils/pricing";

interface PricingPlanCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    monthlyPrice: number;
    description: string;
    features: string[];
    isPopular: boolean;
    icon: React.ReactNode;
    gradient: string;
    buttonColor: string;
    period: string;
    badge: string;
    paymentInfo: string;
  };
  upgradingCardId?: string | null;
  mcards?: any[];
  onSelectPlan: (planId: 'essential' | 'premium') => void;
}

export const PricingPlanCard = ({ plan, upgradingCardId, mcards = [], onSelectPlan }: PricingPlanCardProps) => {
  const priceInfo = getPriceInfoForCountry('SN');

  return (
    <Card 
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
          onClick={() => onSelectPlan(plan.id as 'essential' | 'premium')}
          disabled={!upgradingCardId && mcards.length >= 3}
        >
          {!upgradingCardId && mcards.length >= 3 ? (
            "Limite atteinte (3/3)"
          ) : upgradingCardId ? (
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
  );
};
