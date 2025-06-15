
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { DemoTabsNavigation } from "./tabs/DemoTabsNavigation";
import { DemoSearchTab } from "./tabs/DemoSearchTab";
import { DemoReportTab } from "./tabs/DemoReportTab";
import { DemoAdditionalInfo } from "./tabs/DemoAdditionalInfo";

export const DemoTabs = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'report'>('search');
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t("stepByStep")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("chooseScenario")}
          </p>
        </motion.div>

        <DemoTabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'search' ? <DemoSearchTab /> : <DemoReportTab />}
        
        <DemoAdditionalInfo />
      </div>
    </section>
  );
};
