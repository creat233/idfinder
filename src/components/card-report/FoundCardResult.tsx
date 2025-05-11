
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, CreditCard, ArrowRight } from "lucide-react";
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
    // Envoyer notification que l'utilisateur souhaite récupérer sa carte
    toast({
      title: "Demande enregistrée",
      description: "Votre demande de récupération a été enregistrée. Vous serez contacté prochainement.",
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
      <Card className="w-full max-w-2xl mx-auto border border-primary/10 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-primary">Carte trouvée</CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              Disponible
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Une carte correspondant à votre recherche a été trouvée
          </p>
        </CardHeader>
        
        <CardContent className="pt-6 pb-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Numéro de carte</p>
                <p className="font-semibold">{cardData.card_number}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trouvée le</p>
                <p className="font-semibold">{formatDate(cardData.found_date)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lieu</p>
                <p className="font-semibold">{cardData.location}</p>
              </div>
            </div>

            <div className="mt-2 pt-4 border-t">
              <p className="text-sm text-center text-muted-foreground">
                Type de document : <span className="font-medium">{getDocumentTypeLabel(cardData.document_type)}</span>
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 pb-6 flex justify-center">
          <Button 
            onClick={handleRetrieveClick}
            className="w-full max-w-xs py-6 text-lg group"
          >
            Récupérer ma carte
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Récupérer votre carte</DialogTitle>
            <DialogDescription>
              Veuillez confirmer que vous souhaitez récupérer cette carte. Nous vous contacterons avec les instructions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <p className="text-sm">
              Pour récupérer votre carte, vous devrez présenter une pièce d'identité valide au bureau désigné.
            </p>
            <p className="text-sm font-medium">
              Numéro de carte: <span className="font-bold">{cardData.card_number}</span>
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleConfirmRetrieval}>Confirmer la récupération</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
