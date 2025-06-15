
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/providers/TranslationProvider";

export const DemoCTA = () => {
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
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("readyToStart")}
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            {t("joinCommunity")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-[#9b87f5] hover:bg-gray-100 font-semibold px-8 py-4 rounded-full shadow-lg"
              onClick={() => window.location.href = '/signaler'}
            >
              {t("startNow")}
            </Button>
            <Button 
              onClick={handleDownloadAPK}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 rounded-full"
            >
              <Download className="mr-2 h-5 w-5" />
              {t("downloadApp")}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
