
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Briefcase, Phone, Mail, Globe, ExternalLink, Wifi, RefreshCw, Calendar } from "lucide-react";
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
      {/* NFC Style Card */}
      <Card className="overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative">
        {/* NFC Icon */}
        <div className="absolute top-4 right-4">
          <Wifi className="h-6 w-6 text-blue-300" />
        </div>
        
        <CardContent className="p-8">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full border-2 border-blue-300 shadow-lg overflow-hidden bg-gray-700">
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

          {/* Basic Info */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">{mcard.full_name}</h1>
            {mcard.job_title && (
              <p className="text-blue-200 mb-1">{mcard.job_title}</p>
            )}
            {mcard.company && (
              <p className="text-blue-300 flex items-center justify-center gap-1 text-sm">
                <Briefcase className="h-4 w-4" />
                {mcard.company}
              </p>
            )}
          </div>

          {/* Quick Contact Info */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            {mcard.phone_number && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-blue-300" />
                <span className="text-blue-100">{mcard.phone_number}</span>
              </div>
            )}
            {mcard.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-blue-300" />
                <span className="text-blue-100">{mcard.email}</span>
              </div>
            )}
            {mcard.website_url && (
              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4 text-blue-300" />
                <span className="text-blue-100">Site web</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Card */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* Plan Badge and Subscription Info */}
          <div className="flex flex-col items-center mb-6 space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge 
                variant={mcard.plan === 'premium' ? 'default' : 'secondary'} 
                className="text-lg px-4 py-2"
              >
                Plan {mcard.plan === 'premium' ? 'Premium' : 'Essentiel'}
              </Badge>
              <Badge 
                variant={mcard.subscription_status === 'active' ? 'default' : 'destructive'}
                className="px-3 py-1"
              >
                {mcard.subscription_status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>

            {/* Subscription Expiry Info */}
            {mcard.subscription_expires_at && isOwner && (
              <div className="text-center">
                <div className={`flex items-center gap-2 text-sm ${isExpiringSoon ? 'text-orange-600' : 'text-gray-600'}`}>
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

            {/* Renewal Button */}
            {isOwner && (daysRemaining <= 60 || mcard.subscription_status !== 'active') && (
              <Button 
                onClick={handleRenewalRequest}
                className={`flex items-center gap-2 ${isExpiringSoon ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                variant={isExpiringSoon ? 'default' : 'outline'}
              >
                <RefreshCw className="h-4 w-4" />
                Renouveler ma carte
              </Button>
            )}
          </div>

          {/* Description */}
          {mcard.description && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-center">{mcard.description}</p>
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
