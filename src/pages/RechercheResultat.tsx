
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
import { FreeCardContactButton } from "@/components/card-search/FreeCardContactButton";

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
  recovery_base_fee?: number;
  recovery_currency?: string;
  recovery_currency_symbol?: string;
  recovery_final_price?: number;
  reporter_phone?: string;
}

const RechercheResultat = () => {
  const { cardNumber } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<ReportedCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
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
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reported_cards')
        .select('*')
        .eq('card_number', cardNumber)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching card:', error);
        throw error;
      }

      if (data) {
        console.log('Found card data:', data);
        setCard(data);
        
        // Afficher le message de redirection pendant 2-3 secondes
        setRedirecting(true);
        setTimeout(() => {
          setRedirecting(false);
        }, 2500);
        
        toast({
          title: "Carte trouvée !",
          description: "Votre document a été trouvé avec succès.",
        });
      } else {
        console.log('No card found for number:', cardNumber);
        setCard(null);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des données",
        variant: "destructive",
      });
      setCard(null);
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

  const isFreeCard = card?.document_type === 'student_card' || card?.document_type === 'health_card';

  // Affichage pendant le chargement
  if (loading) {
    return <CardSearchLoading />;
  }

  // Affichage si la carte n'est pas trouvée
  if (!card) {
    return <CardNotFound onBackToHome={handleBackToHome} />;
  }

  // Affichage du message de redirection
  if (redirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PublicHeader />
        <main className="flex-1 pt-16 sm:pt-20 pb-8 sm:pb-16 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-green-800 mb-2">
                  Carte trouvée !
                </h2>
                <p className="text-green-600 mb-4">
                  Votre document a été trouvé. Redirection en cours...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Affichage principal avec les détails de la carte
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 pt-16 sm:pt-20 pb-8 sm:pb-16">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            
            <div className="mb-6 sm:mb-8">
              <CardFoundHero />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <CardDetailsCard card={card} />
                <SecurityInfoCard />
                
                <div className="hidden sm:block">
                  <RecoveryInstructions />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 space-y-4">
                  
                  <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                    {isFreeCard ? (
                      <FreeCardContactButton card={card} />
                    ) : (
                      <RecoveryActionButton onRecoveryClick={handleRecoveryClick} />
                    )}
                  </div>

                  {!isFreeCard && (
                    <div className="hidden lg:block bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2 text-sm">
                        📋 Informations rapides
                      </h3>
                      <div className="space-y-2 text-xs text-blue-700">
                        <div className="flex justify-between">
                          <span>Frais de base:</span>
                          <span className="font-semibold">
                            {card.recovery_base_fee ? `${card.recovery_base_fee} ${card.recovery_currency_symbol || 'FCFA'}` : '7000 FCFA'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prix final:</span>
                          <span className="font-semibold text-green-600">
                            {card.recovery_final_price ? `${card.recovery_final_price} ${card.recovery_currency_symbol || 'FCFA'}` : 'À déterminer'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Livraison:</span>
                          <span className="font-semibold">Disponible</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:hidden mt-6">
              <RecoveryInstructions />
            </div>

            {!isFreeCard && (
              <div className="sm:hidden mt-6 bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                  💡 Informations importantes
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-800">
                      {card.recovery_base_fee ? `${card.recovery_base_fee}` : '7000'} {card.recovery_currency_symbol || 'FCFA'}
                    </div>
                    <div className="text-blue-600">Frais de récupération</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-semibold text-green-800">Réduction</div>
                    <div className="text-green-600">Avec code promo</div>
                  </div>
                </div>
              </div>
            )}

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
                    href="tel:+221710117579" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    📞 +221710117579
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

      {!isFreeCard && showOwnerDialog && (
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
