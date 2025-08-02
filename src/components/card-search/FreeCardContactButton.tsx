import { Button } from "@/components/ui/button";
import { Phone, Gift } from "lucide-react";

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
  reporter_phone?: string;
}

interface FreeCardContactButtonProps {
  card: ReportedCard;
}

export const FreeCardContactButton = ({ card }: FreeCardContactButtonProps) => {
  const handleCallReporter = () => {
    if (card.reporter_phone) {
      window.location.href = `tel:${card.reporter_phone}`;
    }
  };

  const getCardTypeLabel = () => {
    return card.document_type === 'student_card' ? 'étudiante' : 'de santé';
  };

  return (
    <div className="text-center space-y-4">
      {/* Service gratuit badge */}
      <div className="bg-green-100 border border-green-300 rounded-lg p-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-800">Service Gratuit</span>
        </div>
        <p className="text-sm text-green-700">
          ✨ La récupération des cartes {getCardTypeLabel()}s est entièrement gratuite
        </p>
      </div>

      {/* Contact direct */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-3">
          📞 Contact Direct
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          Contactez directement la personne qui a trouvé votre carte :
        </p>
        
        {card.reporter_phone ? (
          <Button 
            onClick={handleCallReporter}
            size="lg"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                       py-3 px-6 text-base rounded-lg
                       shadow-lg hover:shadow-xl transition-all duration-200
                       active:scale-[0.98]"
          >
            <Phone className="mr-2 h-5 w-5" />
            Appeler {card.reporter_phone}
          </Button>
        ) : (
          <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
            Numéro de téléphone non disponible
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">
          📋 Instructions pour la récupération
        </h4>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>1. Appelez le numéro ci-dessus</p>
          <p>2. Présentez-vous et expliquez que vous cherchez votre carte</p>
          <p>3. Convenez d'un lieu de rendez-vous sécurisé</p>
          <p>4. Apportez une pièce d'identité pour prouver que la carte vous appartient</p>
        </div>
      </div>

      {/* Sécurité */}
      <div className="text-xs text-gray-500 text-center">
        🔒 Rencontrez-vous dans un lieu public et sécurisé
      </div>
    </div>
  );
};