
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export const HeroStatusDisplay = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-green-300">{t("statusReported")}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-yellow-300">{t("statusNotified")}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-blue-300">{t("statusRecovery")}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
