import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { getCountryInfo } from "@/utils/countryUtils";

export const EmergencyHeader = () => {
  const { t, currentCountry, currentLanguage, user } = useTranslation();

  const countryInfo = getCountryInfo(currentCountry, currentLanguage);
  const countryName = countryInfo.name;

  const pageTitle = user 
    ? t('emergency_page_title_with_country', { country: countryName })
    : t('emergency_page_title_generic');

  return (
    <>
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 pt-8"
      >
        <h1 className="text-4xl font-bold mb-4">{pageTitle}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('emergency_page_subtitle')}
        </p>
      </motion.div>
    </>
  );
};
