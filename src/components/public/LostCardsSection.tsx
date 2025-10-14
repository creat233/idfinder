import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, FileText } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    loadReportedCards();

    // Subscribe to realtime updates
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

  const filteredCards = cards.filter(card => {
    const query = searchQuery.toLowerCase();
    return (
      card.card_number.toLowerCase().includes(query) ||
      card.location.toLowerCase().includes(query) ||
      card.document_type.toLowerCase().includes(query)
    );
  });

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      id: "Carte d'identité",
      passport: "Passeport",
      driver_license: "Permis de conduire",
      vehicle_card: "Carte grise",
      student_card: "Carte d'étudiant",
      health_card: "Carte de santé"
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">
        🔍 Cartes Perdues Signalées
      </h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par numéro, lieu ou type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/80 text-lg">
            {searchQuery ? "Aucune carte trouvée pour cette recherche" : "Aucune carte signalée pour le moment"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Card 
              key={card.id}
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white/95 backdrop-blur"
              onClick={() => navigate(`/recherche/${card.card_number}`)}
            >
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">
                      ****{card.card_number.slice(-4)}
                    </h3>
                    <Badge variant="outline">
                      {getDocumentTypeLabel(card.document_type)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {card.location}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Trouvée le {new Date(card.found_date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
