
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Briefcase, Phone, Mail, Globe, Wifi, Share2 } from "lucide-react";
import { MCard } from "@/types/mcard";

interface MCardViewProfileCardProps {
  mcard: MCard;
  onShare: () => void;
}

export const MCardViewProfileCard = ({ mcard, onShare }: MCardViewProfileCardProps) => {
  const handleShareProfile = () => {
    const shareText = `Découvrez ma carte de visite digitale - ${mcard.full_name}`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: shareText,
        text: shareText,
        url: shareUrl
      });
    } else {
      onShare();
    }
  };

  return (
    <Card className="overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative transform hover:scale-105 transition-all duration-300">
      {/* Effets de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full animate-pulse"></div>
      
      {/* NFC Icon */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
          <Wifi className="h-6 w-6 text-blue-300" />
        </div>
      </div>
      
      <CardContent className="p-8 relative z-10">
        {/* Profile Picture avec effet halo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-md opacity-75"></div>
            <div className="relative w-24 h-24 rounded-full border-3 border-white/30 shadow-2xl overflow-hidden bg-gray-700/50 backdrop-blur-sm">
              {mcard.profile_picture_url ? (
                <img 
                  src={mcard.profile_picture_url} 
                  alt={mcard.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-12 w-12 text-blue-300" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info avec animations */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">{mcard.full_name}</h1>
          {mcard.job_title && (
            <p className="text-blue-200 mb-2 text-lg font-medium">{mcard.job_title}</p>
          )}
          {mcard.company && (
            <p className="text-blue-300 flex items-center justify-center gap-2 text-sm">
              <Briefcase className="h-4 w-4" />
              {mcard.company}
            </p>
          )}
        </div>

        {/* Quick Contact Info avec design moderne */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {mcard.phone_number && (
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <Phone className="h-5 w-5 text-blue-300" />
              <span className="text-blue-100 font-medium">{mcard.phone_number}</span>
            </div>
          )}
          {mcard.email && (
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <Mail className="h-5 w-5 text-blue-300" />
              <span className="text-blue-100 font-medium">{mcard.email}</span>
            </div>
          )}
          {mcard.website_url && (
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <Globe className="h-5 w-5 text-blue-300" />
              <span className="text-blue-100 font-medium">Site web</span>
            </div>
          )}
        </div>

        {/* Bouton de partage rapide */}
        <div className="flex justify-center">
          <Button
            onClick={handleShareProfile}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Partager ma carte
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
