import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface MCardComplianceWarningProps {
  isOwner: boolean;
}

export const MCardComplianceWarning = ({ isOwner }: MCardComplianceWarningProps) => {
  if (!isOwner) return null;

  return (
    <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-red-800">
        <strong>⚠️ Avertissement Important :</strong> Votre carte peut être désactivée automatiquement si vous ajoutez :
        <ul className="mt-2 ml-4 space-y-1 text-sm">
          <li>• Produits ou services illégaux</li>
          <li>• Photos inappropriées ou à caractère sexuel</li>
          <li>• Contenu offensant ou discriminatoire</li>
          <li>• Informations fausses ou trompeuses</li>
        </ul>
        <p className="mt-2 text-sm">
          Respectez nos conditions d'utilisation pour maintenir votre carte active. 
          En cas de désactivation, vous recevrez une notification par email.
        </p>
      </AlertDescription>
    </Alert>
  );
};