import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, FileText, Search, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReportedCard {
  id: string;
  card_number: string;
  document_type: string;
  location: string;
  found_date: string;
  description: string | null;
  photo_url: string | null;
  status: string;
  created_at: string;
}

export const LostCardsSection = () => {
  const [cards, setCards] = useState<ReportedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadReportedCards();

    // Écouter les mises à jour en temps réel
    const channel = supabase
      .channel('reported-cards-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reported_cards'
        },
        () => {
          loadReportedCards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadReportedCards = async () => {
    try {
      const { data, error } = await supabase
        .from('reported_cards')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des cartes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'id': 'Carte d\'identité',
      'passport': 'Passeport',
      'driver_license': 'Permis de conduire',
      'student_card': 'Carte d\'étudiant',
      'health_card': 'Carte de santé',
      'other': 'Autre'
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      'pending': { label: 'En attente', variant: 'secondary' },
      'recovery_requested': { label: 'Récupération demandée', variant: 'default' },
      'recovery_confirmed': { label: 'Récupération confirmée', variant: 'default' },
      'completed': { label: 'Terminé', variant: 'outline' },
      'cancelled': { label: 'Annulé', variant: 'destructive' }
    };
    const config = statusConfig[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredCards = cards.filter(card =>
    card.card_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDocumentTypeLabel(card.document_type).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔍 Cartes Signalées Perdues
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Retrouvez votre carte perdue ou aidez quelqu'un à récupérer la sienne
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher par numéro, lieu ou type de carte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
        </div>

        {filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'Aucune carte trouvée avec ces critères' : 'Aucune carte signalée pour le moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <Card 
                key={card.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm border-2 hover:border-blue-300"
                onClick={() => navigate(`/recherche/${card.card_number}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-semibold">
                      {card.card_number}
                    </CardTitle>
                    {getStatusBadge(card.status)}
                  </div>
                  <Badge variant="outline" className="w-fit">
                    <FileText className="h-3 w-3 mr-1" />
                    {getDocumentTypeLabel(card.document_type)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {card.photo_url && (
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={card.photo_url} 
                        alt="Photo de la carte" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    <span className="line-clamp-2">{card.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      Trouvée le {format(new Date(card.found_date), 'dd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>

                  {card.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {card.description}
                    </p>
                  )}

                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/recherche/${card.card_number}`);
                    }}
                  >
                    Voir les détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredCards.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              {filteredCards.length} carte{filteredCards.length > 1 ? 's' : ''} signalée{filteredCards.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
