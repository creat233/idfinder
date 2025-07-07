
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MCardViewContactInfo } from "./MCardViewContactInfo";
import { MCardViewQuickActions } from "./MCardViewQuickActions";
import { MCardVerificationDialog } from "../MCardVerificationDialog";
import { MCardVerifiedBadge } from "../MCardVerifiedBadge";
import { MCard } from "@/types/mcard";
import { Mail, Phone, Globe, MapPin, Briefcase, Building, CheckCircle } from "lucide-react";

interface MCardViewProfileProps {
  mcard: MCard;
  onCopyLink: () => void;
  onShare: () => void;
  isOwner: boolean;
}

const getInitials = (name: string): string => {
  if (!name) return "NN";
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return (initials.length > 2 ? initials.substring(0, 2) : initials).toUpperCase();
};

export const MCardViewProfile = ({ mcard, onCopyLink, onShare, isOwner }: MCardViewProfileProps) => {
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const isPendingPayment = mcard.subscription_status === 'pending_payment';
  const canRequestVerification = isOwner && !mcard.is_verified && mcard.verification_status !== 'pending';

  const handleCopyLink = () => {
    if (isPendingPayment) {
      // Ne pas permettre de copier le lien si en attente de paiement
      return;
    }
    onCopyLink();
  };

  const handleShare = () => {
    if (isPendingPayment) {
      // Ne pas permettre de partager si en attente de paiement
      return;
    }
    onShare();
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-8">
        {/* Message d'avertissement pour carte en attente */}
        {isPendingPayment && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-orange-600 font-medium">⏳ Carte en attente d'activation</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              Votre carte est visible mais le partage et le QR code seront disponibles après validation par un administrateur.
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Photo de profil et informations principales */}
          <div className="flex flex-col items-center text-center md:text-left">
            <Avatar className="w-32 h-32 mb-4 shadow-lg ring-4 ring-white">
              <AvatarImage 
                src={mcard.profile_picture_url || undefined} 
                alt={mcard.full_name || 'Profile picture'}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(mcard.full_name || '')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{mcard.full_name}</h1>
              <MCardVerifiedBadge isVerified={mcard.is_verified || false} />
            </div>
            
            {mcard.job_title && (
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Briefcase className="h-4 w-4" />
                <span className="text-lg">{mcard.job_title}</span>
              </div>
            )}
            
            {mcard.company && (
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Building className="h-4 w-4" />
                <span className="text-lg">{mcard.company}</span>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Badge variant="outline" className="px-3 py-1">
                Plan {mcard.plan === 'essential' ? 'Essentiel' : mcard.plan === 'premium' ? 'Premium' : mcard.plan}
              </Badge>
              {mcard.subscription_status && (
                <Badge 
                  variant={mcard.subscription_status === 'active' ? 'default' : 'secondary'}
                  className="px-3 py-1"
                >
                  {mcard.subscription_status === 'active' ? 'Actif' : 
                   mcard.subscription_status === 'pending_payment' ? 'En attente' : 
                   mcard.subscription_status}
                </Badge>
              )}
              {mcard.verification_status === 'pending' && (
                <Badge variant="secondary" className="px-3 py-1 text-orange-600">
                  Vérification en cours
                </Badge>
              )}
            </div>

            {/* Bouton de demande de vérification */}
            {canRequestVerification && (
              <Button
                onClick={() => setIsVerificationDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white mb-4"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Demander la vérification (5 000 FCFA)
              </Button>
            )}
          </div>

          {/* Informations de contact */}
          <div className="flex-1 w-full">
            <MCardViewContactInfo mcard={mcard} />
            
            {mcard.description && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">À propos</h3>
                <p className="text-gray-700 leading-relaxed">{mcard.description}</p>
              </div>
            )}

            {/* Actions rapides - désactivées si en attente de paiement */}
            <MCardViewQuickActions 
              onCopyLink={handleCopyLink} 
              onShare={handleShare}
              disabled={isPendingPayment}
            />
          </div>
        </div>
      </CardContent>

      {/* Dialog de demande de vérification */}
      <MCardVerificationDialog
        isOpen={isVerificationDialogOpen}
        onOpenChange={setIsVerificationDialogOpen}
        mcardId={mcard.id}
        mcardName={mcard.full_name}
      />
    </Card>
  );
};
