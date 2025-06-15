import { useEffect, useRef, useState } from 'react';
import { Header } from "@/components/Header";
import { useMCards, MCard } from "@/hooks/useMCards";
import { MCardsList } from "@/components/mcards/MCardsList";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MCardFeatures } from '@/components/mcards/MCardFeatures';
import { MCardPricing } from '@/components/mcards/MCardPricing';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, parseISO } from 'date-fns';
import { MCardFormDialog } from '@/components/mcards/MCardFormDialog';
import { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

const MCards = () => {
  const { mcards, loading, createMCard, updateMCard, deleteMCard, requestPlanUpgrade } = useMCards();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const pricingRef = useRef<HTMLElement>(null);
  const [upgradingCardId, setUpgradingCardId] = useState<string | null>(null);
  const [notifiedCards, setNotifiedCards] = useState<string[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMCard, setEditingMCard] = useState<MCard | null>(null);
  const [planForNewCard, setPlanForNewCard] = useState<'free' | 'essential' | 'premium' | null>(null);

  const handleOpenEdit = (mcard: MCard) => {
    setPlanForNewCard(null);
    setEditingMCard(mcard);
    setIsFormOpen(true);
  };
  
  useEffect(() => {
    const editMCardId = location.state?.editMCardId;
    if (editMCardId && mcards.length > 0) {
        const cardToEdit = mcards.find(m => m.id === editMCardId);
        if (cardToEdit) {
            handleOpenEdit(cardToEdit);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }
  }, [location.state, mcards, navigate]);

  useEffect(() => {
    mcards.forEach(mcard => {
      if (mcard.plan === 'free' && mcard.subscription_expires_at && !notifiedCards.includes(mcard.id)) {
        const expiryDate = parseISO(mcard.subscription_expires_at);
        const daysLeft = differenceInDays(expiryDate, new Date());

        if (daysLeft < 0) {
          toast({
            variant: "destructive",
            title: t('freePlanExpiredTitle'),
            description: t('freePlanExpiredDescription').replace('{cardName}', mcard.full_name || 'Sans nom'),
            duration: 9000,
          });
          setNotifiedCards(prev => [...prev, mcard.id]);
        } else if (daysLeft <= 3) {
          toast({
            title: t('freePlanExpiryTitle'),
            description: t('freePlanExpiryDescription')
              .replace('{cardName}', mcard.full_name || 'Sans nom')
              .replace('{daysLeft}', String(daysLeft)),
            duration: 9000,
          });
          setNotifiedCards(prev => [...prev, mcard.id]);
        }
      }
    });
  }, [mcards, t, toast, notifiedCards]);

  const handleInitiateUpgrade = (cardId: string) => {
    setUpgradingCardId(cardId);
    pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleStartCreationFlow = (plan: 'free' | 'essential' | 'premium') => {
    setEditingMCard(null);
    setPlanForNewCard(plan);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: TablesInsert<'mcards'> | TablesUpdate<'mcards'>, profilePictureFile: File | null) => {
    if (editingMCard) {
      const result = await updateMCard(editingMCard.id, data, profilePictureFile, editingMCard);
      if (result) {
        setIsFormOpen(false);
        setEditingMCard(null);
      }
    } else if (planForNewCard) {
      const newCardData: TablesInsert<'mcards'> = {
        ...(data as TablesInsert<'mcards'>),
        plan: planForNewCard,
        subscription_status: planForNewCard === 'free' ? 'trial' : 'pending_payment',
      };
      
      const result = await createMCard(newCardData, profilePictureFile, { silent: true });

      if (result) {
        if (planForNewCard === 'free') {
          toast({ title: t('mCardCreatedSuccess'), description: t('mCardFreePlanActive') });
        } else {
          const planName = planForNewCard === 'essential' ? t('planEssential') : t('planPremium');
          toast({ 
            title: t('planUpgradeRequestSent'),
            description: t('planUpgradeRequestSentDescription').replace('{planName}', planName)
          });
        }
        setIsFormOpen(false);
        setPlanForNewCard(null);
      }
    }
  };

  const handleRequestUpgrade = async (mcardId: string, plan: 'essential' | 'premium') => {
    await requestPlanUpgrade(mcardId, plan);
    setUpgradingCardId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("back") || "Retour"}
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{t('mCardTitle')}</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">{t('mCardDescription')}</p>
        </div>
        
        <MCardFeatures />
        <section ref={pricingRef} className="scroll-mt-20">
            <MCardPricing 
                mcards={mcards}
                onRequestUpgrade={handleRequestUpgrade}
                upgradingCardId={upgradingCardId}
                onStartCreationFlow={handleStartCreationFlow}
            />
        </section>

        <div className="max-w-7xl mx-auto mt-16">
            <MCardsList
                mcards={mcards}
                loading={loading}
                updateMCard={updateMCard}
                deleteMCard={deleteMCard}
                onStartUpgradeFlow={handleInitiateUpgrade}
                onEdit={handleOpenEdit}
            />
        </div>
      </main>
      <MCardFormDialog
        isOpen={isFormOpen}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setEditingMCard(null);
            }
            setIsFormOpen(isOpen);
        }}
        onSubmit={handleFormSubmit}
        mcard={editingMCard}
        loading={loading}
      />
    </div>
  );
};

export default MCards;
