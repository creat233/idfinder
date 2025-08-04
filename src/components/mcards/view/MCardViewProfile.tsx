
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MCardViewContactInfo } from "./MCardViewContactInfo";
import { MCardViewQuickActions } from "./MCardViewQuickActions";
import { MCardVerificationDialog } from "../MCardVerificationDialog";
import { MCardVerifiedBadge } from "../MCardVerifiedBadge";
import { MCardSocialLinks } from "../MCardSocialLinks";
import { MCardAnalyticsDashboard } from "../MCardAnalyticsDashboard";
import { MCardMessageDialog } from "../MCardMessageDialog";
import { MCard } from "@/types/mcard";
import { MCardInteractionButtons } from "../MCardInteractionButtons";
import { Mail, Phone, Globe, MapPin, Briefcase, Building, CheckCircle, MessageCircle } from "lucide-react";

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
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
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
      <CardContent className="p-4 sm:p-6 lg:p-8">
        {/* Message d'avertissement pour carte en attente */}
        {isPendingPayment && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-orange-600 font-medium text-sm sm:text-base">⏳ Carte en attente d'activation</span>
            </div>
            <p className="text-xs sm:text-sm text-orange-700 mt-1">
              Votre carte est visible mais le partage et le QR code seront disponibles après validation par un administrateur.
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
          {/* Photo de profil et informations principales - Responsive */}
          <div className="flex flex-col items-center text-center lg:text-left w-full lg:w-auto">
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mb-3 sm:mb-4 shadow-lg ring-4 ring-white">
              <AvatarImage 
                src={mcard.profile_picture_url || undefined} 
                alt={mcard.full_name || 'Profile picture'}
                className="object-cover"
              />
              <AvatarFallback className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(mcard.full_name || '')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words text-center sm:text-left">{mcard.full_name}</h1>
              <MCardVerifiedBadge isVerified={mcard.is_verified || false} />
            </div>
            
            {mcard.job_title && (
              <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 mb-2">
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-sm sm:text-base lg:text-lg text-center lg:text-left break-words">{mcard.job_title}</span>
              </div>
            )}
            
            {mcard.company && (
              <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 mb-3 sm:mb-4">
                <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-sm sm:text-base lg:text-lg text-center lg:text-left break-words">{mcard.company}</span>
              </div>
            )}

            <div className="flex flex-wrap justify-center lg:justify-start gap-1 sm:gap-2 mb-3 sm:mb-4">
              <Badge variant="outline" className="px-2 py-1 text-xs sm:text-sm">
                Plan {mcard.plan === 'essential' ? 'Essentiel' : mcard.plan === 'premium' ? 'Premium' : mcard.plan}
              </Badge>
              {mcard.subscription_status && (
                <Badge 
                  variant={mcard.subscription_status === 'active' ? 'default' : 'secondary'}
                  className="px-2 py-1 text-xs sm:text-sm"
                >
                  {mcard.subscription_status === 'active' ? 'Actif' : 
                   mcard.subscription_status === 'pending_payment' ? 'En attente' : 
                   mcard.subscription_status}
                </Badge>
              )}
              {mcard.verification_status === 'pending' && (
                <Badge variant="secondary" className="px-2 py-1 text-xs sm:text-sm text-orange-600">
                  Vérification en cours
                </Badge>
              )}
            </div>

            {/* Bouton de demande de vérification - Responsive */}
            {canRequestVerification && (
              <Button
                onClick={() => setIsVerificationDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white mb-3 sm:mb-4 w-full sm:w-auto"
                size="sm"
              >
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm">Demander la vérification (5 000 FCFA)</span>
              </Button>
            )}
          </div>

          {/* Informations de contact - Responsive */}
          <div className="flex-1 w-full min-w-0">
            <MCardViewContactInfo mcard={mcard} />
            
            {mcard.description && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">À propos</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">{mcard.description}</p>
              </div>
            )}

            {/* Actions rapides - désactivées si en attente de paiement */}
            <MCardViewQuickActions 
              onCopyLink={handleCopyLink} 
              onShare={handleShare}
              disabled={isPendingPayment}
            />

            {/* Boutons d'interaction (favoris, partage, message) */}
            {!isOwner && !isPendingPayment && (
              <div className="mt-3 sm:mt-4">
                <MCardInteractionButtons
                  mcardId={mcard.id}
                  mcardOwnerId={mcard.user_id}
                  mcardOwnerName={mcard.full_name}
                  className="justify-center"
                />
              </div>
            )}

            {/* Bouton pour envoyer un message (seulement pour les propriétaires en attente) - Responsive */}
            {!isOwner && isPendingPayment && (
              <div className="mt-3 sm:mt-4">
                <Button
                  onClick={() => setIsMessageDialogOpen(true)}
                  variant="outline"
                  className="w-full text-sm sm:text-base"
                  size="sm"
                >
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Envoyer un message
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Réseaux sociaux - Responsive */}
        <div className="mt-6 sm:mt-8">
          <MCardSocialLinks mcard={mcard} />
        </div>

        {/* Analytics Dashboard pour les propriétaires vérifiés - Responsive */}
        {isOwner && (
          <div className="mt-6 sm:mt-8">
            <MCardAnalyticsDashboard mcardId={mcard.id} isVerified={mcard.is_verified || false} />
          </div>
        )}
      </CardContent>

      {/* Dialog de demande de vérification */}
      <MCardVerificationDialog
        isOpen={isVerificationDialogOpen}
        onOpenChange={setIsVerificationDialogOpen}
        mcardId={mcard.id}
        mcardName={mcard.full_name}
      />

      {/* Dialog pour envoyer un message */}
      <MCardMessageDialog
        isOpen={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        recipientId={mcard.user_id}
        recipientName={mcard.full_name}
        mcardId={mcard.id}
      />
    </Card>
  );
};
