
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Camera } from "lucide-react";
import { useTranslation } from "@/providers/TranslationProvider";

interface DemoTabsNavigationProps {
  activeTab: 'search' | 'report';
  setActiveTab: (tab: 'search' | 'report') => void;
}

export const DemoTabsNavigation = ({ activeTab, setActiveTab }: DemoTabsNavigationProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex justify-center mb-16"
    >
      <div className="bg-white rounded-2xl p-2 shadow-xl border border-gray-100">
        <Button
          onClick={() => setActiveTab('search')}
          variant={activeTab === 'search' ? 'default' : 'ghost'}
          className={`rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-300 ${
            activeTab === 'search'
              ? 'bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white shadow-lg transform scale-105'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <MapPin className="w-6 h-6 mr-3" />
          {t("lostMyDocument")}
        </Button>
        <Button
          onClick={() => setActiveTab('report')}
          variant={activeTab === 'report' ? 'default' : 'ghost'}
          className={`rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-300 ${
            activeTab === 'report'
              ? 'bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white shadow-lg transform scale-105'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Camera className="w-6 h-6 mr-3" />
          {t("foundADocument")}
        </Button>
      </div>
    </motion.div>
  );
};
