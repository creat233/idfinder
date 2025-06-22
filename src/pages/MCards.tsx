
import { Header } from "@/components/Header";
import { useMCards } from "@/hooks/useMCards";
import { MCardsList } from "@/components/mcards/MCardsList";
import { MCardFeatures } from '@/components/mcards/MCardFeatures';
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <MCardsHeader onCreateCard={handleStartCreationFlow} />
        
        <MCardFeatures />
        
        <section ref={pricingRef} className="scroll-mt-20">
          <MCardPricing 
            mcards={mcards}
            onRequestUpgrade={(mcardId, plan) => handleRequestUpgrade(mcardId, plan, requestPlanUpgrade)}
            upgradingCardId={upgradingCardId}
            onStartCreationFlow={handleStartCreationFlow}
          />
        </section>

        <div className="max-w-7xl mx-auto mt-16">
          <MCardsList
            mcards={mcards}
            loading={loading}
            deleteMCard={deleteMCard}
            onStartUpgradeFlow={handleInitiateUpgrade}
            onEdit={handleOpenEdit}
          />
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
