
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, CheckCircle } from "lucide-react";
import { OwnerInfoDialog } from "@/components/card-report/OwnerInfoDialog";
import { useToast } from "@/hooks/use-toast";

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

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'id': return 'Carte d\'identité';
      case 'passport': return 'Passeport';
      case 'license': return 'Permis de conduire';
      default: return 'Document';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="animate-pulse">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Carte non trouvée
              </h1>
              <p className="text-gray-600 mb-8">
                Cette carte n'existe pas ou n'est plus disponible pour récupération.
              </p>
              <Button onClick={() => navigate("/")} className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* En-tête de succès */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Carte trouvée !
              </h1>
              <p className="text-lg text-gray-600">
                Votre document a été signalé sur FinderID
              </p>
            </div>

            {/* Détails de la carte */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Détails du document</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Trouvée
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Type de document</h3>
                    <p className="text-gray-600">{getDocumentTypeLabel(card.document_type)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Numéro</h3>
                    <p className="text-gray-600 font-mono">{card.card_number}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Lieu de découverte</h3>
                    <p className="text-gray-600">{card.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Date de découverte</h3>
                    <p className="text-gray-600">{formatDate(card.found_date)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Signalée le</h3>
                    <p className="text-gray-600">{formatDate(card.created_at)}</p>
                  </div>
                </div>

                {card.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Description</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </div>
                )}

                {/* Message de sécurité à la place de la photo */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">🔒 Sécurité des données</h3>
                  <p className="text-sm text-blue-700">
                    Pour votre sécurité et la protection de vos données personnelles, la photo du document n'est pas affichée publiquement. Elle sera présentée lors de la vérification d'identité pendant le processus de récupération.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Instructions de récupération */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Prochaines étapes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[#9b87f5] text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                    <p className="text-gray-700">Confirmez votre identité en cliquant sur "Récupérer ma carte"</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[#9b87f5] text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                    <p className="text-gray-700">Utilisez un code promo si vous en avez un pour bénéficier d'une réduction</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[#9b87f5] text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                    <p className="text-gray-700">Nous organiserons la récupération de votre document</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bouton de récupération */}
            <div className="text-center">
              <Button 
                onClick={() => setShowOwnerDialog(true)}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
              >
                Récupérer ma carte
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Frais de récupération : 7000 FCFA (réductible avec un code promo)
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Dialog pour les informations du propriétaire avec code promo */}
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
