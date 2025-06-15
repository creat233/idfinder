
import { motion } from "framer-motion";
import { useTranslation } from "@/providers/TranslationProvider";

export const DemoAdditionalInfo = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      viewport={{ once: true }}
      className="mt-16 text-center"
    >
      <div className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] rounded-2xl p-8 text-white shadow-2xl">
        <h3 className="text-2xl font-bold mb-4">{t("fastAndSecure")}</h3>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div>
            <div className="text-3xl font-bold">24h</div>
            <div className="text-purple-100">{t("averageRecoveryTime")}</div>
          </div>
          <div>
            <div className="text-3xl font-bold">2000 Fr</div>
            <div className="text-purple-100">{t("finderRewardPlatform")}</div>
          </div>
          <div>
            <div className="text-3xl font-bold">100%</div>
            <div className="text-purple-100">{t("securePlatform")}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
