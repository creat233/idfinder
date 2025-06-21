
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { createMissingCardNotification, debugCardNotificationSystem } from "@/utils/notificationUtils";
import { Bug, Bell } from "lucide-react";

interface NotificationDebugButtonProps {
  cardNumber?: string;
}

export const NotificationDebugButton = ({ cardNumber = "1234567890" }: NotificationDebugButtonProps) => {
  const [isDebugging, setIsDebugging] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();

  const handleDebug = async () => {
    setIsDebugging(true);
    try {
      const result = await debugCardNotificationSystem(cardNumber);
      
      if (result) {
        console.log("🔍 Résultats du diagnostic:", result);
        
        const { summary } = result;
        let message = "Diagnostic terminé:\n";
        message += `- Carte ajoutée: ${summary.hasUserCard ? "✅" : "❌"}\n`;
        message += `- Carte signalée: ${summary.hasReportedCard ? "✅" : "❌"}\n`;
        message += `- Notification créée: ${summary.hasNotification ? "✅" : "❌"}\n`;
        message += `- Mode vacances: ${summary.userInVacationMode ? "🏖️ Oui" : "❌ Non"}`;

        showInfo("Diagnostic du système", message);
      } else {
        showError("Erreur", "Impossible de faire le diagnostic");
      }
    } catch (error) {
      console.error("Erreur diagnostic:", error);
      showError("Erreur", "Erreur lors du diagnostic");
    } finally {
      setIsDebugging(false);
    }
  };

  const handleCreateNotification = async () => {
    setIsCreating(true);
    try {
      const result = await createMissingCardNotification(cardNumber);
      
      if (result.success) {
        showSuccess("Notification créée", "La notification manquante a été créée avec succès");
      } else {
        showInfo("Information", result.message || "Impossible de créer la notification");
      }
    } catch (error) {
      console.error("Erreur création notification:", error);
      showError("Erreur", "Erreur lors de la création de la notification");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium text-yellow-800 mb-2">🔧 Outils de diagnostic</h3>
        <p className="text-sm text-yellow-700 mb-3">
          Si vous n'avez pas reçu de notification pour votre carte {cardNumber}, utilisez ces outils :
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDebug}
          disabled={isDebugging}
          className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
        >
          <Bug className="h-4 w-4 mr-2" />
          {isDebugging ? "Diagnostic..." : "Diagnostiquer"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreateNotification}
          disabled={isCreating}
          className="text-blue-700 border-blue-300 hover:bg-blue-100"
        >
          <Bell className="h-4 w-4 mr-2" />
          {isCreating ? "Création..." : "Créer notification"}
        </Button>
      </div>
    </div>
  );
};
