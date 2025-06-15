
import { Button } from "@/components/ui/button";
import { ArrowRight, Share2, Download } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CardSearchForm } from "@/components/card-search/CardSearchForm";
import { useTranslation } from "@/hooks/useTranslation";

export const DashboardHero = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleInviteFriend = () => {
    const siteUrl = window.location.origin;
    const apkUrl = `${siteUrl}/FinderID (1).apk`;
    const message = t("inviteMessageShare", { siteUrl, apkUrl });
    
    if (navigator.share) {
      navigator.share({
        title: t("inviteTitleShare"),
        text: message,
        url: siteUrl
      });
    } else {
      navigator.clipboard.writeText(message);
      toast({
        title: t("linkCopiedTitle"),
        description: t("linkCopiedDesc"),
      });
    }
  };

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

  return (
    <section className="bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white pt-24 pb-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {t("dashboardHeroTitle")}
        </h1>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          {t("dashboardHeroSubtitle")}
        </p>
        
        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <CardSearchForm />
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <RouterLink to="/signaler">
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            >
              {t("cta_report_found_card")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </RouterLink>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 rounded-full transition-all duration-300"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t("howItWorks")}
          </Button>
        </div>

        {/* Invite & Download Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleInviteFriend}
            variant="ghost"
            className="text-white border border-white/30 hover:bg-white hover:text-[#9b87f5] px-6 py-3 rounded-full transition-all duration-300"
          >
            <Share2 className="mr-2 h-5 w-5" />
            {t("inviteFriend")}
          </Button>
          
          <Button 
            onClick={handleDownloadAPK}
            variant="ghost"
            className="text-white border border-white/30 hover:bg-white hover:text-[#9b87f5] px-6 py-3 rounded-full transition-all duration-300"
          >
            <Download className="mr-2 h-5 w-5" />
            📱 {t("downloadApp")}
          </Button>
        </div>
      </div>
    </section>
  );
};
