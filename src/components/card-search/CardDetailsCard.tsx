import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, CreditCard, FileText, CheckCircle } from "lucide-react";

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
      case 'driver_license': return 'Permis de conduire';
      case 'student_card': return 'Carte étudiante';
      case 'vehicle_registration': return 'Carte grise véhicule';
      case 'motorcycle_registration': return 'Carte grise moto';
      case 'residence_permit': return 'Titre de séjour';
      default: return 'Document d\'identité';
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
    <Card className="shadow-sm border-2 border-green-100">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-lg sm:text-xl">Détails du document</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800 self-start sm:self-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Trouvée
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Main info grid - responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Type de document</h3>
              <p className="text-gray-600 text-sm break-words">{getDocumentTypeLabel(card.document_type)}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
            <CreditCard className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Numéro</h3>
              <p className="text-gray-600 font-mono text-sm break-all">{card.card_number}</p>
            </div>
          </div>
        </div>

        {/* Location - full width */}
        <div className="flex items-start space-x-3 p-3 sm:p-4 bg-red-50 rounded-lg">
          <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Lieu de découverte</h3>
            <p className="text-gray-600 text-sm break-words">{card.location}</p>
          </div>
        </div>

        {/* Dates grid - responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <Calendar className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Date de découverte</h3>
              <p className="text-gray-600 text-sm">{formatDate(card.found_date)}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
            <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Signalée le</h3>
              <p className="text-gray-600 text-sm">{formatDate(card.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Description if available */}
        {card.description && (
          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed break-words">{card.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
