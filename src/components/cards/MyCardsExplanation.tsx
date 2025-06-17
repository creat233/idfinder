
import { useTranslation } from "@/hooks/useTranslation";

export const MyCardsExplanation = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-semibold text-blue-800 mb-2">
        {t("howItWorks") || "Comment ça marche ?"}
      </h3>
      <p className="text-sm text-blue-700">
        {t("cardsExplanation") ||
          "Ajoutez les numéros de vos cartes d'identité pour recevoir automatiquement une notification si quelqu'un les signale comme trouvées sur FinderID. Vous pourrez ainsi les récupérer rapidement."}
      </p>
    </div>
  );
};
