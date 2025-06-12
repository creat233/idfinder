
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { OwnerInfoDialog } from "@/components/card-report/OwnerInfoDialog";
import { useToast } from "@/hooks/use-toast";
import { CardFoundHero } from "@/components/card-search/CardFoundHero";
import { CardDetailsCard } from "@/components/card-search/CardDetailsCard";
import { SecurityInfoCard } from "@/components/card-search/SecurityInfoCard";
import { RecoveryInstructions } from "@/components/card-search/RecoveryInstructions";
import { RecoveryActionButton } from "@/components/card-search/RecoveryActionButton";
import { CardSearchLoading } from "@/components/card-search/CardSearchLoading";
import { CardNotFound } from "@/components/card-search/CardNotFound";

interface ReportedCard {
  id: string;
  card_number: string;
  document_type: string;
  location: string;
  found_date: string;
  description?: string;
  photo_url?: string;
  status: string;
  created_at: string;
}

const RechercheResultat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<ReportedCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const { toast } = useToast();
  const cardId = searchParams.get("id");

  useEffect(() => {
    if (!cardId) {
      toast({
        title: "Erreur",
        description: "ID de carte manquant",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    fetchCardDetails();
  }, [cardId]);

  const fetchCardDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('reported_cards')
        .select('*')
        .eq('id', cardId)
        .eq('status', 'pending')
        .single();

      if (error) {
        console.error('Error fetching card:', error);
        toast({
          title: "Carte non trouvée",
          description: "Cette carte n'existe pas ou n'est plus disponible",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setCard(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleRecoveryClick = () => {
    setShowOwnerDialog(true);
  };

  if (loading) {
    return <CardSearchLoading />;
  }

  if (!card) {
    return <CardNotFound onBackToHome={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <CardFoundHero />
            <CardDetailsCard card={card} />
            <SecurityInfoCard />
            <RecoveryInstructions />
            <RecoveryActionButton onRecoveryClick={handleRecoveryClick} />
          </div>
        </div>
      </div>

      <Footer />

      {showOwnerDialog && (
        <OwnerInfoDialog
          isOpen={showOwnerDialog}
          onClose={() => setShowOwnerDialog(false)}
          cardData={{
            id: card.id,
            card_number: card.card_number,
            document_type: card.document_type,
            location: card.location,
          }}
        />
      )}
    </div>
  );
};

export default RechercheResultat;
