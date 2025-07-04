
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface AddCardDialogProps {
  onAddCard: (cardData: {
    card_number: string;
    document_type: string;
    card_holder_name?: string;
  }) => Promise<void>;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  prefillCardNumber?: string;
}

// Ce composant fonctionne :
// - en mode contrôlé (open/setOpen/prefillCardNumber fournis)
// - ou en mode non contrôlé (modale ouverte par défaut interne)
export const AddCardDialog = ({
  onAddCard,
  open: dialogOpenFromProps,
  setOpen: setDialogOpenFromProps,
  prefillCardNumber,
}: AddCardDialogProps) => {
  // Mode contrôlé vs non contrôlé
  const [internalOpen, setInternalOpen] = useState(false);
  const open = dialogOpenFromProps !== undefined ? dialogOpenFromProps : internalOpen;
  const setOpen =
    setDialogOpenFromProps !== undefined ? setDialogOpenFromProps : setInternalOpen;

  const [cardNumber, setCardNumber] = useState("");
  const [documentType, setDocumentType] = useState("id");
  const [cardHolderName, setCardHolderName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { t } = useTranslation();

  // Lorsque la modale s'ouvre ET prefillCardNumber change, pré-remplir le cardNumber
  useEffect(() => {
    if (open && prefillCardNumber) {
      setCardNumber(prefillCardNumber);
    }
  }, [open, prefillCardNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber.trim()) return;

    setSubmitting(true);
    try {
      await onAddCard({
        card_number: cardNumber.trim(),
        document_type: documentType,
        card_holder_name: cardHolderName.trim() || undefined,
      });
      // Reset form
      setCardNumber("");
      setCardHolderName("");
      setDocumentType("id");
      setOpen(false);
    } catch (error) {
      console.error("Error adding card:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Afficher le bouton d’ajout seulement en mode non contrôlé (dialog ouvert interne) */}
      {dialogOpenFromProps === undefined && (
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("addCard") || "Ajouter une carte"}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addCard") || "Ajouter une carte"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="documentType">{t("documentType") || "Type de document"}</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">{t("idCard") || "Carte d'identité"}</SelectItem>
                <SelectItem value="passport">{t("passport") || "Passeport"}</SelectItem>
                <SelectItem value="driver_license">{t("driverLicense") || "Permis de conduire"}</SelectItem>
                <SelectItem value="student_card">{t("studentCard") || "Carte d'étudiant"}</SelectItem>
                <SelectItem value="health_card">{t("healthCard") || "Carte de santé"}</SelectItem>
                <SelectItem value="vehicle_registration">{t("vehicleRegistration") || "Carte grise véhicule"}</SelectItem>
                <SelectItem value="motorcycle_registration">{t("motorcycleRegistration") || "Carte grise moto"}</SelectItem>
                <SelectItem value="residence_permit">{t("residencePermit") || "Carte de séjour"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cardNumber">{t("cardNumber") || "Numéro de la carte"}</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder={t("enterCardNumber") || "Entrez le numéro de la carte"}
              required
            />
          </div>
          <div>
            <Label htmlFor="cardHolderName">{t("cardHolderName") || "Nom du titulaire"} ({t("optional") || "Optionnel"})</Label>
            <Input
              id="cardHolderName"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              placeholder={t("enterCardHolderName") || "Entrez le nom du titulaire"}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("cancel") || "Annuler"}
            </Button>
            <Button type="submit" disabled={submitting || !cardNumber.trim()}>
              {submitting ? (t("adding") || "Ajout...") : (t("add") || "Ajouter")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
