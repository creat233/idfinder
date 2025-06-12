
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const OwnerInfoDialogHeader = () => {
  return (
    <DialogHeader className="text-center sm:text-left">
      <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
        Confirmer votre identité
      </DialogTitle>
      <DialogDescription className="text-sm sm:text-base text-gray-600 mt-2">
        Pour récupérer votre carte, nous avons besoin de vos informations de contact.
      </DialogDescription>
    </DialogHeader>
  );
};
