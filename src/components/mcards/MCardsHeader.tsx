
import { useTranslation } from "@/hooks/useTranslation";

export const MCardsHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{t('mCardTitle')}</h1>
      <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">{t('mCardDescription')}</p>
    </div>
  );
};
