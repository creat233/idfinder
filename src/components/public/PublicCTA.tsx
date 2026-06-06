
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
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, hsl(var(--vapor-indigo) / 0.25), hsl(var(--vapor-cyan) / 0.15), hsl(var(--vapor-lavender) / 0.25))'
      }} />
      <div className="container mx-auto px-4 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-white">
            {user ? t("cta_continue_helping") : t("cta_ready_to_not_lose_documents")}
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            {user ? t("cta_report_found_cards_help_others") : t("cta_join_community")}
          </p>

          {!isLoading && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={handleMainAction}
                className="text-slate-900 hover:opacity-90 font-semibold px-8 py-6 rounded-full shadow-xl"
                style={{ background: 'linear-gradient(135deg, hsl(var(--vapor-mist)), hsl(var(--vapor-lavender)))' }}>
                {user ? (<><Plus className="mr-3 h-5 w-5" />{t("cta_report_found_card")}</>)
                      : (<><Smartphone className="mr-3 h-5 w-5" />{t("cta_start_on_web")}</>)}
              </Button>
              <Button onClick={handleDownloadAPK} variant="outline" size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 rounded-full bg-white/5 backdrop-blur-md">
                <Download className="mr-3 h-5 w-5" />{t("cta_download_android_app")}
              </Button>
            </div>
          )}

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-white">+1000</div>
              <div className="text-slate-400 text-sm">{t("cta_stats_documents_found")}</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-white">24h</div>
              <div className="text-slate-400 text-sm">{t("cta_stats_average_time")}</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold vapor-gradient-text">100%</div>
              <div className="text-slate-400 text-sm">{t("cta_stats_secure")}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
