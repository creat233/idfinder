
import { useEffect, useRef, useState } from 'react';
import { Header } from "@/components/Header";
import { useMCards } from "@/hooks/useMCards";
import { MCardsList } from "@/components/mcards/MCardsList";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MCardFeatures } from '@/components/mcards/MCardFeatures';
import { MCardPricing } from '@/components/mcards/MCardPricing';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, parseISO } from 'date-fns';

const MCards = () => {
  const { mcards, loading, getMCards, createMCard, updateMCard, deleteMCard, requestPlanUpgrade } = useMCards();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const pricingRef = useRef<HTMLElement>(null);
  const [upgradingCardId, setUpgradingCardId] = useState<string | null>(null);
  const [notifiedCards, setNotifiedCards] = useState<string[]>([]);

  useEffect(() => {
    getMCards();
  }, [getMCards]);

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
    setUploadingCardId(cardId);
    pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleRequestUpgrade = async (mcardId: string, plan: 'essential' | 'premium') => {
    await requestPlanUpgrade(mcardId, plan);
    setUploadingCardId(null);
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
            />
        </section>

        <div className="max-w-7xl mx-auto mt-16">
            <MCardsList
                mcards={mcards}
                loading={loading}
                createMCard={createMCard}
                updateMCard={updateMCard}
                deleteMCard={deleteMCard}
                onStartUpgradeFlow={handleInitiateUpgrade}
            />
        </div>
      </main>
    </div>
  );
};

export default MCards;
