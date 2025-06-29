
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar } from "lucide-react";
import { MCard } from "@/types/mcard";
import { MCardSocialLinks } from "@/components/mcards/MCardSocialLinks";
import { MCardViewContactInfo } from "./MCardViewContactInfo";
import { MCardViewQuickActions } from "./MCardViewQuickActions";
import { useMCardRenewal } from "@/hooks/useMCardRenewal";

interface MCardViewProfileDetailsProps {
  mcard: MCard;
  onCopyLink: () => void;
  onShare: () => void;
  isOwner: boolean;
}

export const MCardViewProfileDetails = ({ 
  mcard, 
  onCopyLink, 
  onShare, 
  isOwner 
}: MCardViewProfileDetailsProps) => {
  const { handleRenewalRequest, getDaysRemaining } = useMCardRenewal();

  const daysRemaining = getDaysRemaining(mcard.subscription_expires_at);
  const isExpiringSoon = daysRemaining <= 30;

  const onRenewalClick = () => {
    handleRenewalRequest(mcard.id, mcard.plan);
  };

  return (
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
              onClick={onRenewalClick}
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
  );
};
