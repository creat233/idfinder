
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

interface UseMyCardsAutoAddProps {
  cards: any[];
  addCard: (data: { card_number: string; document_type: string }) => Promise<void>;
  refetchCards?: () => void;
  onShowAdModal: () => void;
}

export const useMyCardsAutoAdd = ({ 
  cards, 
  addCard, 
  refetchCards, 
  onShowAdModal 
}: UseMyCardsAutoAddProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAutoAdding, setIsAutoAdding] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const handleAutoAddCard = async (numeroCarte: string) => {
      if (isAutoAdding || !numeroCarte) return;

      const numeroNorm = numeroCarte.trim();
      if (!numeroNorm) return;
      if (cards.some(card => card.card_number === numeroNorm)) {
        searchParams.delete("ajouter");
        setSearchParams(searchParams, { replace: true });
        return;
      }
      
      setIsAutoAdding(true);
      try {
        await addCard({
          card_number: numeroNorm,
          document_type: "id",
        });
        refetchCards?.();
        onShowAdModal();
      } catch (e) {
        toast({
          title: t("addCardError") || "Erreur",
          description:
            t("addCardErrorDescription") ||
            "Une erreur est survenue, merci de réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsAutoAdding(false);
        searchParams.delete("ajouter");
        setSearchParams(searchParams, { replace: true });
      }
    };

    const cardToAdd = searchParams.get("ajouter");
    if (cardToAdd) {
      handleAutoAddCard(cardToAdd);
    }
  }, [searchParams, setSearchParams, cards, addCard, refetchCards, onShowAdModal, isAutoAdding, toast, t]);

  return { isAutoAdding };
};
