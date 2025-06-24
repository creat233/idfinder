
import { Header } from "@/components/Header";
import { useMCards } from "@/hooks/useMCards";
import { MCardsList } from "@/components/mcards/MCardsList";
import { MCardFeatures } from '@/components/mcards/MCardFeatures';
import { MCardFeaturesDetailed } from '@/components/mcards/MCardFeaturesDetailed';
import { MCardShowcase } from '@/components/mcards/MCardShowcase';
import { MCardDemo } from '@/components/mcards/MCardDemo';
import { MCardPricing } from '@/components/mcards/MCardPricing';
import { MCardFormDialog } from '@/components/mcards/MCardFormDialog';
import { MCardsHeader } from '@/components/mcards/MCardsHeader';
import { useMCardsNotificationHandler } from '@/hooks/useMCardsNotificationHandler';
import { useMCardsUpgradeHandler } from '@/hooks/useMCardsUpgradeHandler';
import { useMCardsFormHandler } from '@/hooks/useMCardsFormHandler';
import { useTranslation } from "@/hooks/useTranslation";

const MCards = () => {
  const { mcards, loading, createMCard, updateMCard, deleteMCard, requestPlanUpgrade } = useMCards();
  const { t } = useTranslation();

  // Handle notifications for expiring cards
  useMCardsNotificationHandler(mcards);

  // Handle upgrade flow
  const {
    upgradingCardId,
    pricingRef,
    handleInitiateUpgrade,
    handleRequestUpgrade,
  } = useMCardsUpgradeHandler();

  // Handle form operations
  const {
    isFormOpen,
    editingMCard,
    isCreating,
    formLoading,
    handleOpenEdit,
    handleStartCreationFlow,
    handleFormSubmit,
    handleFormOpenChange,
  } = useMCardsFormHandler({ mcards, createMCard, updateMCard, loading });

  // Wrapper function to handle the upgrade request with the correct signature
  const handleUpgradeRequest = async (mcardId: string, plan: 'essential' | 'premium') => {
    await handleRequestUpgrade(mcardId, plan, requestPlanUpgrade);
  };

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
        
        {/* Démonstration Interactive - Responsive */}
        <div className="w-full">
          <MCardDemo />
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
              deleteMCard={deleteMCard}
              onStartUpgradeFlow={handleInitiateUpgrade}
              onEdit={handleOpenEdit}
            />
          </div>
        </div>
      </main>
      
      <MCardFormDialog
        isOpen={isFormOpen}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        mcard={editingMCard}
        loading={formLoading || isCreating}
      />
    </div>
  );
};

export default MCards;
