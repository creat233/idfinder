
import { useEffect, useRef, useState } from 'react';
import { Header } from "@/components/Header";
import { useMCards } from "@/hooks/useMCards";
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
import { MCard, MCardCreateData, MCardUpdateData } from '@/types/mcard';

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
  const [isCreating, setIsCreating] = useState(false);

  const handleOpenEdit = (mcard: MCard) => {
    console.log('Ouverture de l\'édition pour la carte:', mcard);
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
    console.log('Démarrage du flux de création pour le plan:', plan);
    setEditingMCard(null);
    setPlanForNewCard(plan);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: MCardCreateData | MCardUpdateData, profilePictureFile: File | null): Promise<MCard | null> => {
    try {
      console.log('handleFormSubmit appelé avec:', { data, profilePictureFile, editingMCard, planForNewCard });
      
      if (editingMCard) {
        console.log('Mode édition');
        const result = await updateMCard(editingMCard.id, data, profilePictureFile, editingMCard);
        if (result) {
          setIsFormOpen(false);
          setEditingMCard(null);
          console.log('Carte mise à jour avec succès:', result);
        }
        return result;
      } else if (planForNewCard) {
        console.log('Mode création avec plan:', planForNewCard);
        setIsCreating(true);
        
        const newCardData: MCardCreateData = {
          ...(data as MCardCreateData),
          plan: planForNewCard,
          subscription_status: planForNewCard === 'free' ? 'trial' : 'pending_payment',
        };
        
        console.log('Données de création:', newCardData);
        
        const result = await createMCard(newCardData, profilePictureFile, { silent: true });
        console.log('Résultat de createMCard:', result);

        if (result) {
          if (planForNewCard === 'free') {
            console.log('Plan gratuit - toast de succès');
            toast({ title: t('mCardCreatedSuccess'), description: t('mCardFreePlanActive') });
          } else {
            const planName = planForNewCard === 'essential' ? t('planEssential') : t('planPremium');
            console.log('Plan payant - toast de demande de mise à niveau');
            toast({ 
              title: t('planUpgradeRequestSent'),
              description: t('planUpgradeRequestSentDescription').replace('{planName}', planName)
            });
          }
          setIsFormOpen(false);
          setPlanForNewCard(null);
          console.log('Création terminée avec succès');
        } else {
          console.error('createMCard a retourné null');
        }
        
        setIsCreating(false);
        return result;
      }
      
      console.warn('Ni editingMCard ni planForNewCard défini');
      return null;
    } catch (error) {
      console.error('Erreur dans handleFormSubmit:', error);
      setIsCreating(false);
      throw error;
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
                deleteMCard={deleteMCard}
                onStartUpgradeFlow={handleInitiateUpgrade}
                onEdit={handleOpenEdit}
            />
        </div>
      </main>
      <MCardFormDialog
        isOpen={isFormOpen}
        onOpenChange={(isOpen) => {
            console.log('Dialog onOpenChange:', isOpen);
            if (!isOpen) {
                setEditingMCard(null);
                setPlanForNewCard(null);
            }
            setIsFormOpen(isOpen);
        }}
        onSubmit={handleFormSubmit}
        mcard={editingMCard}
        loading={loading || isCreating}
      />
    </div>
  );
};

export default MCards;
