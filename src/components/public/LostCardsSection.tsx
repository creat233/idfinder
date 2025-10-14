import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

interface ReportedCard {
  id: string;
  card_number: string;
  location: string;
  found_date: string;
  document_type: string;
  photo_url?: string;
  created_at: string;
}

export const LostCardsSection = () => {
  const [cards, setCards] = useState<ReportedCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    loadCards();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('reported_cards_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reported_cards'
        },
        () => {
          loadCards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadCards = async () => {
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

  const filteredCards = cards.filter(card => 
    card.card_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.document_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (cardNumber: string) => {
    navigate(`/recherche/${cardNumber}`);
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'id': 'Carte d\'identité',
      'driver_license': 'Permis de conduire',
      'passport': 'Passeport',
      'student_card': 'Carte d\'étudiant',
      'health_card': 'Carte de santé',
      'other': 'Autre document'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">📋 Cartes Signalées</h2>
        <p className="text-muted-foreground mb-6">
          Parcourez les cartes trouvées et signalées par notre communauté
        </p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro, lieu ou type de document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? "Aucune carte ne correspond à votre recherche" : "Aucune carte signalée pour le moment"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Card 
              key={card.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCardClick(card.card_number)}
            >
              {card.photo_url && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={card.photo_url} 
                    alt="Photo de la carte"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Numéro de carte</span>
                  <p className="font-semibold text-lg">{card.card_number}</p>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-muted-foreground">Lieu</span>
                    <p className="text-sm">{card.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-muted-foreground">Date de découverte</span>
                    <p className="text-sm">
                      {new Date(card.found_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {getDocumentTypeLabel(card.document_type)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
