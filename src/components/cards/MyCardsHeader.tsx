
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { AddCardDialog } from "./AddCardDialog";

interface MyCardsHeaderProps {
  cardCount: number;
  onAddCard: (data: { card_number: string; document_type: string }) => Promise<void>;
}

export const MyCardsHeader = ({ cardCount, onAddCard }: MyCardsHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("back") || "Retour"}
      </Button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("myCards") || "Mes cartes"}</h1>
        <AddCardDialog onAddCard={onAddCard} />
      </div>
    </>
  );
};
