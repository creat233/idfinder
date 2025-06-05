
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, CreditCard, ArrowRight, Phone, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface FoundCardResultProps {
  cardData: {
    card_number: string;
    document_type: string;
    found_date: string;
    location: string;
    id: string;
    description?: string;
  };
}

export const FoundCardResult = ({ cardData }: FoundCardResultProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleRetrieveClick = () => {
    setIsDialogOpen(true);
  };
  
  const handleConfirmRetrieval = () => {
    setIsDialogOpen(false);
    toast({
      title: "Demande enregistrée",
      description: "Votre demande de récupération a été enregistrée. Vous serez contacté prochainement pour organiser la récupération.",
    });
  };

  // Formater le type de document pour l'affichage
  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'id':
        return 'Carte Nationale d\'Identité';
      case 'passport':
        return 'Passeport';
      case 'driver_license':
        return 'Permis de conduire';
      case 'student_card':
        return 'Carte étudiante';
      case 'vehicle_registration':
        return 'Carte grise véhicule';
      case 'motorcycle_registration':
        return 'Carte grise moto';
      case 'residence_permit':
        return 'Titre de séjour';
      default:
        return 'Document d\'identité';
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto border-2 border-green-200 bg-green-50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Carte trouvée !</CardTitle>
                <p className="text-green-100 text-sm">Une carte correspondant à votre recherche a été trouvée</p>
              </div>
            </div>
            <Badge className="bg-green-600 text-white border-green-400 px-4 py-2 text-sm font-semibold">
              Disponible
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 pb-4 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="bg-blue-100 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro de carte</p>
                <p className="font-bold text-gray-900 text-lg">{cardData.card_number}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="bg-purple-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Trouvée le</p>
                <p className="font-bold text-gray-900">{formatDate(cardData.found_date)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <div className="bg-red-100 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Lieu de découverte</p>
              <p className="font-bold text-gray-900">{cardData.location}</p>
              {cardData.description && (
                <p className="text-sm text-gray-600 mt-1">{cardData.description}</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-600" />
              <p className="text-sm font-medium text-gray-600">Type de document</p>
            </div>
            <p className="font-semibold text-gray-900">{getDocumentTypeLabel(cardData.document_type)}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Informations de récupération</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Frais de récupération : <strong>7000 Fr</strong> (incluant la récompense du trouveur)</p>
              <p>• Livraison à domicile disponible (frais supplémentaires à votre charge)</p>
              <p>• Récupération en main propre possible selon accord avec le trouveur</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 pb-6 bg-gray-50 border-t">
          <Button 
            onClick={handleRetrieveClick}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg group"
          >
            <Phone className="mr-2 h-5 w-5" />
            Récupérer ma carte
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Récupérer votre carte</DialogTitle>
            <DialogDescription className="text-gray-600">
              Confirmez votre demande de récupération. Nous organiserons le contact avec la personne qui a trouvé votre carte.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Récapitulatif :</strong>
              </p>
              <p className="text-sm"><strong>Numéro :</strong> {cardData.card_number}</p>
              <p className="text-sm"><strong>Type :</strong> {getDocumentTypeLabel(cardData.document_type)}</p>
              <p className="text-sm"><strong>Lieu :</strong> {cardData.location}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Prochaines étapes :</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Vérification de votre identité requise</li>
                <li>• Contact avec la personne qui a trouvé votre carte</li>
                <li>• Organisation de la récupération ou livraison</li>
                <li>• Paiement des frais : 7000 Fr + livraison si applicable</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirmRetrieval} className="bg-green-500 hover:bg-green-600">
              Confirmer la récupération
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
