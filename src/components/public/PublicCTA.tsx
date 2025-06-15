
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { useTranslation } from "@/hooks/useTranslation";

interface PublicCTAProps {
  user?: User | null;
  isLoading?: boolean;
}

export const PublicCTA = ({ user, isLoading }: PublicCTAProps) => {
  const navigate = useNavigate();
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
      title: t("download_started"),
      description: t("download_started_desc"),
    });
  };

  const handleMainAction = () => {
    if (user) {
      navigate("/signaler");
    } else {
      navigate("/login");
    }
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
            {user ? t("cta_continue_helping") : t("cta_ready_to_not_lose_documents")}
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            {user 
              ? t("cta_report_found_cards_help_others")
              : t("cta_join_community")
            }
          </p>
          
          {!isLoading && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={handleMainAction}
                className="bg-white text-[#9b87f5] hover:bg-gray-100 font-semibold px-8 py-4 rounded-full shadow-lg"
              >
                {user ? (
                  <>
                    <Plus className="mr-3 h-6 w-6" />
                    {t("cta_report_found_card")}
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-3 h-6 w-6" />
                    {t("cta_start_on_web")}
                  </>
                )}
              </Button>
              <Button 
                onClick={handleDownloadAPK}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 rounded-full"
              >
                <Download className="mr-3 h-6 w-6" />
                {t("cta_download_android_app")}
              </Button>
            </div>
          )}

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">+1000</div>
              <div className="text-purple-200">{t("cta_stats_documents_found")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24h</div>
              <div className="text-purple-200">{t("cta_stats_average_time")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-purple-200">{t("cta_stats_secure")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">🇸🇳</div>
              <div className="text-purple-200">{t("cta_stats_made_in_senegal")}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
