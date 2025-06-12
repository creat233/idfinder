
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock } from "lucide-react";

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

interface CardDetailsCardProps {
  card: ReportedCard;
}

export const CardDetailsCard = ({ card }: CardDetailsCardProps) => {
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

  return (
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
      </CardContent>
    </Card>
  );
};
