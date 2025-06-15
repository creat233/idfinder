
import { useEffect } from 'react';
import { Header } from "@/components/Header";
import { useMCards } from "@/hooks/useMCards";
import { MCardsList } from "@/components/mcards/MCardsList";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MCardFeatures } from '@/components/mcards/MCardFeatures';
import { MCardPricing } from '@/components/mcards/MCardPricing';

const MCards = () => {
  const { mcards, loading, getMCards, createMCard, updateMCard, deleteMCard } = useMCards();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    getMCards();
  }, [getMCards]);

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
        <MCardPricing />

        <div className="max-w-7xl mx-auto mt-16">
            <MCardsList
                mcards={mcards}
                loading={loading}
                createMCard={createMCard}
                updateMCard={updateMCard}
                deleteMCard={deleteMCard}
            />
        </div>
      </main>
    </div>
  );
};

export default MCards;
