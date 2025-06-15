
import { motion } from "framer-motion";
import { EmergencyNumberCard, EmergencyNumberType } from "./EmergencyNumberCard";
import { useTranslation } from "@/providers/TranslationProvider";

interface EmergencyNumbersListProps {
  filteredNumbers: EmergencyNumberType[];
}

export const EmergencyNumbersList = ({ filteredNumbers }: EmergencyNumbersListProps) => {
  const { t } = useTranslation();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {filteredNumbers.length > 0 ? (
        filteredNumbers.map((item, index) => (
          <EmergencyNumberCard key={index} item={item} index={index} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg">{t('no_results_found')}</p>
        </div>
      )}
    </motion.div>
  );
};
