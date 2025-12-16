
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { MCard } from "@/types/mcard";
import { SelectMCardDialog } from "./SelectMCardDialog";
import { pricingPlans } from "./pricing/PricingPlanData";
import { PricingPlanCard } from "./pricing/PricingPlanCard";
import { PricingHeader } from "./pricing/PricingHeader";
import { PricingFooter } from "./pricing/PricingFooter";

interface MCardPricingProps {
  mcards: MCard[];
  onRequestUpgrade: (mcardId: string, plan: 'free' | 'essential' | 'premium' | 'ultimate') => void;
  onStartCreationFlow: (plan: 'free' | 'essential' | 'premium' | 'ultimate') => void;
  upgradingCardId?: string | null;
}

export const MCardPricing = ({ mcards, onRequestUpgrade, onStartCreationFlow, upgradingCardId }: MCardPricingProps) => {
  const { t } = useTranslation();
  const [isSelectCardDialogOpen, setIsSelectCardDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'essential' | 'premium' | 'ultimate' | null>(null);

  // Vérifier si l'utilisateur a déjà une carte gratuite
  const hasFreeMCard = mcards.some(card => card.plan === 'free');

  const handleSelectPlan = (planId: 'free' | 'essential' | 'premium' | 'ultimate') => {
    if (upgradingCardId) {
      onRequestUpgrade(upgradingCardId, planId);
    } else if (mcards.length >= 3) {
      // Limite atteinte : ne pas permettre la création
      return;
    } else if (planId === 'free' && hasFreeMCard) {
      // L'utilisateur a déjà une carte gratuite
      return;
    } else {
      // Permettre la création directe
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
            <PricingHeader />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <PricingPlanCard
                  key={index}
                  plan={plan}
                  upgradingCardId={upgradingCardId}
                  mcards={mcards}
                  hasFreeMCard={hasFreeMCard}
                  onSelectPlan={handleSelectPlan}
                />
              ))}
            </div>

            <PricingFooter />
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
