
import { motion } from "framer-motion";
import { useTranslation } from "@/providers/TranslationProvider";

type DocumentHeaderProps = {
  itemVariants: any;
};

export const DocumentHeader = ({ itemVariants }: DocumentHeaderProps) => {
  const { t } = useTranslation();
  return (
    <>
      <motion.h2 
        variants={itemVariants}
        className="text-2xl font-semibold mb-6"
      >
        {t('doc_header_title')}
      </motion.h2>

      <motion.p 
        variants={itemVariants}
        className="text-gray-600 mb-8"
      >
        {t('doc_header_subtitle')}
      </motion.p>
    </>
  );
};
