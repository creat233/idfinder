
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export const EmergencyTips = () => {
  const { t } = useTranslation();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200"
    >
      <h2 className="text-xl font-semibold mb-4">{t('emergency_tips_title')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>{t('emergency_tip_1')}</li>
        <li>{t('emergency_tip_2')}</li>
        <li>{t('emergency_tip_3')}</li>
        <li>{t('emergency_tip_4')}</li>
        <li>{t('emergency_tip_5')}</li>
      </ul>
    </motion.div>
  );
};
