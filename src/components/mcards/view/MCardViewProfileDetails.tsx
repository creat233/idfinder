
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, RotateCcw, Loader2 } from "lucide-react";
import { MCard } from "@/types/mcard";
import { MCardSocialLinks } from "@/components/mcards/MCardSocialLinks";
import { MCardViewContactInfo } from "./MCardViewContactInfo";
import { MCardViewQuickActions } from "./MCardViewQuickActions";
import { useMCardRenewal } from "@/hooks/useMCardRenewal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [requestingReactivation, setRequestingReactivation] = useState(false);

  const daysRemaining = getDaysRemaining(mcard.subscription_expires_at);
  const isExpiringSoon = daysRemaining <= 30;
  const isExpired = mcard.subscription_status === 'expired' || daysRemaining === 0;

  const onRenewalClick = () => {
    handleRenewalRequest(mcard.id, mcard.plan);
  };

  const handleReactivationRequest = async () => {
    setRequestingReactivation(true);
    try {
      // Get user info
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('phone').eq('id', user?.id || '').single();

      const { data, error } = await supabase.functions.invoke('send-reactivation-request', {
        body: {
          mcardId: mcard.id,
          mcardName: mcard.full_name,
          plan: mcard.plan,
          userEmail: user?.email,
          userPhone: profile?.phone,
          expirationDate: mcard.subscription_expires_at,
        }
      });

      if (error) throw error;

      // Also insert a renewal request
      await supabase.from('mcard_renewal_requests').insert({
        mcard_id: mcard.id,
        current_plan: mcard.plan,
        requested_at: new Date().toISOString(),
        status: 'pending'
      });

      toast({
        title: "✅ Demande envoyée !",
        description: "Votre demande de réactivation a été envoyée à l'administration. Vous serez contacté sous peu.",
      });
    } catch (error) {
      console.error('Reactivation error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la demande. Réessayez.",
      });
    } finally {
      setRequestingReactivation(false);
    }
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

          {/* Bouton de réactivation pour les cartes expirées */}
          {isOwner && isExpired && (
            <Button
              onClick={handleReactivationRequest}
              disabled={requestingReactivation}
              className="flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
            >
              {requestingReactivation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              {requestingReactivation ? 'Envoi en cours...' : 'Demander la réactivation'}
            </Button>
          )}

          {/* Bouton de renouvellement */}
          {isOwner && !isExpired && (daysRemaining <= 60 || mcard.subscription_status !== 'active') && (
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
