
import { useState } from "react";
import { Header } from "@/components/Header";
import { useMCards } from "@/hooks/useMCards";
import { MCardsSEO } from "@/components/seo/MCardsSEO";
import { MCardsList } from "@/components/mcards/MCardsList";
import { MCardFeatures } from '@/components/mcards/MCardFeatures';
import { MCardFeaturesDetailed } from '@/components/mcards/MCardFeaturesDetailed';
import { MCardShowcase } from '@/components/mcards/MCardShowcase';
import { MCardCreationPage } from '@/components/mcards/MCardCreationPage';
import { MCardPricing } from '@/components/mcards/MCardPricing';
import { MCardsHeader } from '@/components/mcards/MCardsHeader';
import { MCardFormDialog } from '@/components/mcards/MCardFormDialog';
import { useMCardsNotificationHandler } from '@/hooks/useMCardsNotificationHandler';
import { useMCardsUpgradeHandler } from '@/hooks/useMCardsUpgradeHandler';
import { useMCardsFormHandler } from '@/hooks/useMCardsFormHandler';
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";

const MCards = () => {
  const { mcards, loading, createMCard, updateMCard, deleteMCard, requestPlanUpgrade } = useMCards();
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

  // Handle form management
  const {
    isFormOpen,
    editingMCard,
    planForNewCard,
    isCreating,
    formLoading,
    handleOpenEdit,
    handleStartCreationFlow: handleFormCreationFlow,
    handleFormSubmit,
    handleFormOpenChange,
  } = useMCardsFormHandler({ 
    mcards, 
    createMCard, 
    updateMCard, 
    loading 
  });

  // Wrapper function to handle the upgrade request with the correct signature
  const handleUpgradeRequest = async (mcardId: string, plan: 'free' | 'essential' | 'premium' | 'ultimate') => {
    // Le plan gratuit n'a pas besoin de demande d'upgrade, créer directement
    if (plan === 'free') {
      handleFormCreationFlow(plan);
      return;
    }
    // Pour les autres plans, suivre le processus normal
    if (plan === 'essential' || plan === 'premium' || plan === 'ultimate') {
      await handleRequestUpgrade(mcardId, plan, requestPlanUpgrade);
    }
  };

  const handleStartCreationFlow = (plan: 'free' | 'essential' | 'premium' | 'ultimate') => {
    // Le plan gratuit démarre directement le formulaire
    if (plan === 'free') {
      handleFormCreationFlow(plan);
    } else {
      // Les plans payants affichent la page de création
      setShowCreationPage(true);
    }
  };

  if (showCreationPage) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="px-3 sm:px-4 lg:px-6 xl:px-8 mb-3 sm:mb-4">
          <Button 
            variant="outline" 
            onClick={() => setShowCreationPage(false)}
            className="mt-3 sm:mt-4 text-sm sm:text-base"
            size="sm"
          >
            ← Retour à l'aperçu
          </Button>
        </div>
        <MCardCreationPage />
      </div>
    );
  }

  return (
    <>
      <MCardsSEO />
      <div className="min-h-screen bg-background pb-24 md:pb-0">
        <Header />
        <main className="w-full">
        {/* Hero Section - Responsive */}
        <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
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
        <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="container mx-auto py-8 sm:py-12 lg:py-16">
            <MCardsList
              mcards={mcards}
              loading={loading}
              deleteMCard={deleteMCard}
              onStartUpgradeFlow={handleInitiateUpgrade}
              onEdit={handleOpenEdit}
            />
          </div>
        </div>
        
        {/* Form Dialog for Creating/Editing MCards */}
        <MCardFormDialog
          isOpen={isFormOpen}
          onOpenChange={handleFormOpenChange}
          onSubmit={handleFormSubmit}
          loading={formLoading}
          mcard={editingMCard}
        />
        </main>
      </div>
    </>
  );
};

export default MCards;
