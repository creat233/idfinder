
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const OwnerInfoDialogHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle className="text-xl font-bold text-gray-900">
        Confirmer votre identité
      </DialogTitle>
      <DialogDescription className="text-gray-600">
        Pour récupérer votre carte, nous avons besoin de vos informations de contact.
      </DialogDescription>
    </DialogHeader>
  );
};
