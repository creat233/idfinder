import { useTranslation } from "@/hooks/useTranslation";

export const MCardsHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
        {t('digitalBusinessCards')}
      </h1>
      <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
        {t('createShareConnect')}
      </p>
    </div>
  );
};
