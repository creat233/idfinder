
import { OwnerInfoForm } from "../OwnerInfoForm";
import { RecoveryPriceSummary } from "../RecoveryPriceSummary";
import { RecoveryNextSteps } from "../RecoveryNextSteps";
import { PriceInfo } from "@/utils/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OwnerInfoDialogContentProps {
  ownerName: string;
  ownerPhone: string;
  onOwnerNameChange: (value: string) => void;
  onOwnerPhoneChange: (value: string) => void;
  onPromoApplied: (discount: number, promoCodeId: string) => void;
  onPromoRemoved: () => void;
  cardData: {
    card_number: string;
    document_type: string;
    location: string;
  };
  baseFee: number;
  discount: number;
  finalPrice: number;
  priceInfo: PriceInfo;
  reporterPhone: string | null;
}

export const OwnerInfoDialogContent = ({
  ownerName,
  ownerPhone,
  onOwnerNameChange,
  onOwnerPhoneChange,
  onPromoApplied,
  onPromoRemoved,
  cardData,
  baseFee,
  discount,
  finalPrice,
  priceInfo,
  reporterPhone,
}: OwnerInfoDialogContentProps) => {
  const isStudentOrHealthCard = cardData.document_type === 'student_card' || cardData.document_type === 'health_card';

  const handleCallReporter = () => {
    if (reporterPhone) {
      window.open(`tel:${reporterPhone}`, '_self');
    }
  };

  const handleWhatsAppReporter = () => {
    if (reporterPhone) {
      const message = encodeURIComponent(`Bonjour, j'ai vu que vous avez trouvé ma carte ${cardData.card_number}. Pouvons-nous nous organiser pour la récupération ?`);
      window.open(`https://wa.me/${reporterPhone.replace(/\D/g, '')}?text=${message}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Affichage du contact direct pour cartes étudiantes et santé */}
      {isStudentOrHealthCard && reporterPhone && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact direct avec le trouveur
              <Badge className="bg-green-600 text-white">Disponible</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <p className="text-sm text-green-700">
                Pour ce type de document, vous pouvez contacter directement la personne qui a trouvé votre carte :
              </p>
              
              <div className="bg-white p-3 rounded-lg border border-green-200">
                <p className="font-semibold text-green-800 mb-2">Numéro du trouveur :</p>
                <p className="text-lg font-bold text-green-900">{reporterPhone}</p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleCallReporter}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
                <Button 
                  onClick={handleWhatsAppReporter}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>

              <p className="text-xs text-green-600">
                💡 Vous pouvez aussi continuer avec la procédure normale ci-dessous
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulaire des informations personnelles */}
      <div className="space-y-4">
        <OwnerInfoForm
          ownerName={ownerName}
          ownerPhone={ownerPhone}
          onOwnerNameChange={onOwnerNameChange}
          onOwnerPhoneChange={onOwnerPhoneChange}
          onPromoApplied={onPromoApplied}
          onPromoRemoved={onPromoRemoved}
        />
      </div>

      {/* Récapitulatif des prix */}
      <div className="space-y-4">
        <RecoveryPriceSummary
          cardData={cardData}
          baseFee={baseFee}
          discount={discount}
          finalPrice={finalPrice}
          priceInfo={priceInfo}
        />
      </div>
      
      {/* Prochaines étapes */}
      <div className="space-y-4">
        <RecoveryNextSteps finalPrice={finalPrice} priceInfo={priceInfo} />
      </div>
    </div>
  );
};
