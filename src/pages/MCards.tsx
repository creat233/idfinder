
import { useEffect } from 'react';
import { Header } from "@/components/Header";
import { useMCards } from "@/hooks/useMCards";
import { MCardsList } from "@/components/mcards/MCardsList";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

        <div className="max-w-7xl mx-auto">
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
