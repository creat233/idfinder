import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash2, CreditCard } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface UserCard {
  id: string;
  card_number: string;
  document_type: string;
  card_holder_name?: string;
  is_active: boolean;
  created_at: string;
}

interface UserCardsListProps {
  cards: UserCard[];
  onToggleStatus: (cardId: string, isActive: boolean) => void;
  onDeleteCard: (cardId: string) => void;
}

export const UserCardsList = ({ cards, onToggleStatus, onDeleteCard }: UserCardsListProps) => {
  const { t } = useTranslation();

  const getDocumentTypeLabel = (type: string, card_holder_name?: string) => {
    // Si type="id" et pas de nom titulaire => carte ajoutée automatiquement, donc "Ma carte"
    if (type === "id" && !card_holder_name) {
      return t("myCard") || "Ma carte";
    }
    switch (type) {
      case "id": return t("idCard") || "Carte d'identité";
      case "passport": return t("passport") || "Passeport";
      case "driver_license": return t("driverLicense") || "Permis de conduire";
      case "student_card": return t("studentCard") || "Carte d'étudiant";
      default: return type;
    }
  };

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            {t("noCardsAdded") || "Aucune carte ajoutée pour le moment"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t("addCardsToReceiveNotifications") || "Ajoutez vos cartes pour recevoir des notifications si elles sont signalées"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <Card key={card.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {getDocumentTypeLabel(card.document_type, card.card_holder_name)}
              </CardTitle>
              <Badge variant={card.is_active ? "default" : "secondary"}>
                {card.is_active ? (t("active") || "Actif") : (t("inactive") || "Inactif")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">{t("cardNumber") || "Numéro"}</p>
                <p className="font-medium">{card.card_number}</p>
              </div>
              
              {card.card_holder_name && (
                <div>
                  <p className="text-sm text-gray-600">{t("cardHolderName") || "Titulaire"}</p>
                  <p className="font-medium">{card.card_holder_name}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={card.is_active}
                    onCheckedChange={(checked) => onToggleStatus(card.id, checked)}
                  />
                  <span className="text-sm">
                    {t("receiveNotifications") || "Recevoir des notifications"}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteCard(card.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
