
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Briefcase, Phone, Mail, Globe, ExternalLink, Wifi, RefreshCw, Calendar, Share2 } from "lucide-react";
import { MCard } from "@/types/mcard";
import { MCardSocialLinks } from "@/components/mcards/MCardSocialLinks";
import { MCardViewContactInfo } from "./MCardViewContactInfo";
import { MCardViewQuickActions } from "./MCardViewQuickActions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MCardViewProfileProps {
  mcard: MCard;
  onCopyLink: () => void;
  onShare: () => void;
  isOwner: boolean;
}

export const MCardViewProfile = ({ mcard, onCopyLink, onShare, isOwner }: MCardViewProfileProps) => {
  const { toast } = useToast();

  const handleRenewalRequest = async () => {
    try {
      const { error } = await supabase
        .from('mcard_renewal_requests')
        .insert([
          {
            mcard_id: mcard.id,
            current_plan: mcard.plan,
            requested_at: new Date().toISOString(),
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Demande de renouvellement envoyée !",
        description: "Votre demande de renouvellement a été envoyée à l'administration. Vous recevrez une confirmation une fois le paiement validé."
      });
    } catch (error) {
      console.error('Erreur lors de la demande de renouvellement:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la demande de renouvellement. Veuillez réessayer."
      });
    }
  };

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
      // Fallback - ouvrir le dialogue de partage
      onShare();
    }
  };

  const getDaysRemaining = () => {
    if (!mcard.subscription_expires_at) return 0;
    const now = new Date();
    const expiry = new Date(mcard.subscription_expires_at);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysRemaining = getDaysRemaining();
  const isExpiringSoon = daysRemaining <= 30;

  return (
    <div className="space-y-6">
      {/* NFC Style Card avec design amélioré */}
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

      {/* Detailed Information Card avec design amélioré */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-6">
          {/* Plan Badge et info abonnement */}
          <div className="flex flex-col items-center mb-6 space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge 
                variant={mcard.plan === 'premium' ? 'default' : 'secondary'} 
                className={`text-lg px-6 py-3 rounded-full ${
                  mcard.plan === 'premium' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                }`}
              >
                Plan {mcard.plan === 'premium' ? 'Premium' : 'Essentiel'}
              </Badge>
              <Badge 
                variant={mcard.subscription_status === 'active' ? 'default' : 'destructive'}
                className="px-4 py-2 rounded-full"
              >
                {mcard.subscription_status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>

            {/* Info expiration */}
            {mcard.subscription_expires_at && isOwner && (
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className={`flex items-center justify-center gap-2 text-sm ${isExpiringSoon ? 'text-orange-600' : 'text-gray-600'}`}>
                  <Calendar className="h-4 w-4" />
                  <span>
                    Expire le {new Date(mcard.subscription_expires_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isExpiringSoon ? 'text-orange-500' : 'text-gray-500'}`}>
                  {daysRemaining > 0 ? `${daysRemaining} jour(s) restant(s)` : 'Expiré'}
                </p>
              </div>
            )}

            {/* Bouton de renouvellement */}
            {isOwner && (daysRemaining <= 60 || mcard.subscription_status !== 'active') && (
              <Button 
                onClick={handleRenewalRequest}
                className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 ${
                  isExpiringSoon 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                } text-white`}
              >
                <RefreshCw className="h-4 w-4" />
                Renouveler ma carte
              </Button>
            )}
          </div>

          {/* Description avec design amélioré */}
          {mcard.description && (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-l-4 border-blue-400">
              <p className="text-gray-700 text-center italic font-medium">{mcard.description}</p>
            </div>
          )}

          {/* Detailed Contact Info */}
          <MCardViewContactInfo mcard={mcard} />

          {/* Social Links */}
          <MCardSocialLinks mcard={mcard} />

          {/* Quick Actions */}
          <MCardViewQuickActions onCopyLink={onCopyLink} onShare={onShare} />
        </CardContent>
      </Card>
    </div>
  );
};
