
import { useState } from "react";
import { Header } from "@/components/Header";
import { useMCards } from "@/hooks/useMCards";
import { MCardsList } from "@/components/mcards/MCardsList";
import { MCardFeatures } from '@/components/mcards/MCardFeatures';
import { MCardFeaturesDetailed } from '@/components/mcards/MCardFeaturesDetailed';
import { MCardShowcase } from '@/components/mcards/MCardShowcase';
import { MCardCreationPage } from '@/components/mcards/MCardCreationPage';
import { MCardPricing } from '@/components/mcards/MCardPricing';
import { MCardsHeader } from '@/components/mcards/MCardsHeader';
import { useMCardsNotificationHandler } from '@/hooks/useMCardsNotificationHandler';
import { useMCardsUpgradeHandler } from '@/hooks/useMCardsUpgradeHandler';
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";

const MCards = () => {
  const { mcards, loading, requestPlanUpgrade } = useMCards();
  const { t } = useTranslation();
  const [showCreationPage, setShowCreationPage] = useState(false);

  // Handle notifications for expiring cards
  useMCardsNotificationHandler(mcards);

  // Handle upgrade flow
  const {
    upgradingCardId,
    pricingRef,
    handleInitiateUpgrade,
    handleRequestUpgrade,
  } = useMCardsUpgradeHandler();

  // Wrapper function to handle the upgrade request with the correct signature
  const handleUpgradeRequest = async (mcardId: string, plan: 'essential' | 'premium') => {
    await handleRequestUpgrade(mcardId, plan, requestPlanUpgrade);
  };

  const handleStartCreationFlow = (plan: 'essential' | 'premium') => {
    setShowCreationPage(true);
  };

  if (showCreationPage) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mb-4 px-4">
          <Button 
            variant="outline" 
            onClick={() => setShowCreationPage(false)}
            className="mt-4"
          >
            ← Retour à l'aperçu
          </Button>
        </div>
        <MCardCreationPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full">
        {/* Hero Section - Responsive */}
        <div className="px-4 sm:px-6 lg:px-8">
          <MCardsHeader />
        </div>
        
        {/* Showcase Section - Responsive */}
        <div className="w-full">
          <MCardShowcase />
        </div>
        
        {/* Features Section - Responsive */}
        <div className="w-full">
          <MCardFeatures />
        </div>
        
        {/* Pricing Section - Responsive */}
        <section ref={pricingRef} className="scroll-mt-20 w-full">
          <MCardPricing 
            mcards={mcards}
            onRequestUpgrade={handleUpgradeRequest}
            upgradingCardId={upgradingCardId}
            onStartCreationFlow={handleStartCreationFlow}
          />
        </section>

        {/* Detailed Features Section - Responsive */}
        <div className="w-full">
          <MCardFeaturesDetailed />
        </div>

        {/* My Cards Section - Responsive */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto py-16">
            <MCardsList
              mcards={mcards}
              loading={loading}
              deleteMCard={async (id: string) => {
                // Cette fonction sera gérée par le hook
              }}
              onStartUpgradeFlow={handleInitiateUpgrade}
              onEdit={(mcard) => {
                // Cette fonction sera gérée par le hook
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MCards;
