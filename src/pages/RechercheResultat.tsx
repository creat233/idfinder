
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { cardNumber } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<ReportedCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!cardNumber) {
      toast({
        title: "Erreur",
        description: "Numéro de carte manquant",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    fetchCardDetails();
  }, [cardNumber]);

  const fetchCardDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('reported_cards')
        .select('*')
        .eq('card_number', cardNumber)
        .eq('status', 'pending')
        .single();

      if (error) {
        console.error('Error fetching card:', error);
        setCard(null);
      } else {
        setCard(data);
      }
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicHeader />
      
      {/* Main content with improved responsive design */}
      <main className="flex-1 pt-16 sm:pt-20 pb-8 sm:pb-16">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          {/* Responsive container with better breakpoints */}
          <div className="max-w-4xl mx-auto">
            
            {/* Hero section with responsive spacing */}
            <div className="mb-6 sm:mb-8">
              <CardFoundHero />
            </div>

            {/* Main content grid - responsive layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              
              {/* Left column - Card details (spans full width on mobile, 2 columns on large screens) */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <CardDetailsCard card={card} />
                <SecurityInfoCard />
                
                {/* Recovery instructions - hidden on mobile to save space, shown on tablet+ */}
                <div className="hidden sm:block">
                  <RecoveryInstructions />
                </div>
              </div>

              {/* Right column - Action button (sticky on large screens) */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 space-y-4">
                  
                  {/* Action button with responsive sizing */}
                  <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                    <RecoveryActionButton onRecoveryClick={handleRecoveryClick} />
                  </div>

                  {/* Quick info card - only visible on desktop */}
                  <div className="hidden lg:block bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2 text-sm">
                      📋 Informations rapides
                    </h3>
                    <div className="space-y-2 text-xs text-blue-700">
                      <div className="flex justify-between">
                        <span>Frais de base:</span>
                        <span className="font-semibold">7000 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Réduction possible:</span>
                        <span className="font-semibold text-green-600">Avec code promo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Livraison:</span>
                        <span className="font-semibold">Disponible</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recovery instructions - shown on mobile at bottom */}
            <div className="sm:hidden mt-6">
              <RecoveryInstructions />
            </div>

            {/* Mobile-specific quick actions */}
            <div className="sm:hidden mt-6 bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                💡 Informations importantes
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-800">7000 FCFA</div>
                  <div className="text-blue-600">Frais de récupération</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-semibold text-green-800">Réduction</div>
                  <div className="text-green-600">Avec code promo</div>
                </div>
              </div>
            </div>

            {/* Contact support section - responsive */}
            <div className="mt-8 sm:mt-12 text-center">
              <div className="bg-gray-100 rounded-lg p-4 sm:p-6">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                  Besoin d'aide ?
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3">
                  Notre équipe est disponible pour vous accompagner dans la récupération de votre document.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center text-xs sm:text-sm">
                  <a 
                    href="tel:+221123456789" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    📞 +221 12 345 67 89
                  </a>
                  <a 
                    href="mailto:support@finderid.com" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ✉️ support@finderid.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
