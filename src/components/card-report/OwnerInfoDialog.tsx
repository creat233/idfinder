
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OwnerInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: {
    id: string;
    card_number: string;
    document_type: string;
    location: string;
  };
}

export const OwnerInfoDialog = ({ isOpen, onClose, cardData }: OwnerInfoDialogProps) => {
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ownerName.trim() || !ownerPhone.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Appeler la fonction Edge pour envoyer l'email de notification
      const { error } = await supabase.functions.invoke('send-recovery-notification', {
        body: {
          cardId: cardData.id,
          ownerInfo: {
            name: ownerName.trim(),
            phone: ownerPhone.trim(),
          }
        }
      });

      if (error) {
        console.error('Error calling edge function:', error);
        throw error;
      }

      toast({
        title: "Demande envoyée",
        description: "Votre demande de récupération a été envoyée. Vous serez contacté prochainement.",
      });

      // Réinitialiser le formulaire et fermer la dialog
      setOwnerName("");
      setOwnerPhone("");
      onClose();
    } catch (error) {
      console.error("Error submitting recovery request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Confirmer votre identité
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Pour récupérer votre carte, nous avons besoin de vos informations de contact.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Nom complet *</Label>
            <Input
              id="ownerName"
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Votre nom et prénom"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ownerPhone">Numéro de téléphone *</Label>
            <Input
              id="ownerPhone"
              type="tel"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              placeholder="Votre numéro de téléphone"
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Récapitulatif :</strong>
            </p>
            <p className="text-sm"><strong>Numéro :</strong> {cardData.card_number}</p>
            <p className="text-sm"><strong>Lieu :</strong> {cardData.location}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Prochaines étapes :</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Vérification de votre identité</li>
              <li>• Contact avec la personne qui a trouvé votre carte</li>
              <li>• Organisation de la récupération ou livraison</li>
              <li>• Paiement des frais : 7000 Fr + livraison si applicable</li>
            </ul>
          </div>
          
          <DialogFooter className="gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-green-500 hover:bg-green-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi en cours..." : "Confirmer la récupération"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
