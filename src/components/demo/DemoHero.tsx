
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

export const DemoHero = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleDownloadAPK = () => {
    const link = document.createElement('a');
    link.href = '/FinderID (1).apk';
    link.download = 'FinderID.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: t("downloadStarted"),
      description: t("downloadingApp"),
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("interactiveDemo")}
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            {t("discoverSamaPiece")}
          </p>
          
          {/* Download Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <Button 
              onClick={handleDownloadAPK}
              size="lg"
              className="bg-white text-[#9b87f5] hover:bg-gray-100 font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Download className="mr-3 h-6 w-6" />
              {t("downloadForAndroid")}
            </Button>
            <p className="text-sm text-purple-200 mt-2">
              {t("neverMissNotification")}
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">2000 Fr</div>
              <div className="text-purple-200">{t("finderRewardTitle")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">7000 Fr</div>
              <div className="text-purple-200">{t("recoveryFeeTitle")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24h</div>
              <div className="text-purple-200">{t("averageTimeTitle")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">🚚</div>
              <div className="text-purple-200">{t("deliveryAvailableTitle")}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
