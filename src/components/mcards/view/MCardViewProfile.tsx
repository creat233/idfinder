
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RobustAvatar } from "@/components/ui/robust-avatar";
import { MCardViewContactInfo } from "./MCardViewContactInfo";
import { MCardViewQuickActions } from "./MCardViewQuickActions";
import { MCardVerificationDialog } from "../MCardVerificationDialog";
import { MCardVerifiedBadge } from "../MCardVerifiedBadge";
import { MCardSocialLinks } from "../MCardSocialLinks";
import { MCardAnalyticsDashboard } from "../MCardAnalyticsDashboard";
import { MCardMessageDialog } from "../MCardMessageDialog";
import { MCardProfileImageDialog } from "./MCardProfileImageDialog";
import { MCard } from "@/types/mcard";
import { MCardInteractionButtons } from "../MCardInteractionButtons";
import { Mail, Phone, Globe, MapPin, Briefcase, Building, CheckCircle, MessageCircle } from "lucide-react";

interface MCardViewProfileProps {
  mcard: MCard;
  onCopyLink: () => void;
  onShare: () => void;
  isOwner: boolean;
}


export const MCardViewProfile = ({ mcard, onCopyLink, onShare, isOwner }: MCardViewProfileProps) => {
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isProfileImageDialogOpen, setIsProfileImageDialogOpen] = useState(false);
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
    <div className="relative">
      {/* Background décoratif */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl" />
      <div className="absolute inset-0 opacity-10 rounded-3xl" style={{backgroundImage: "url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%236366f1\" fill-opacity=\"0.4\"><circle cx=\"30\" cy=\"30\" r=\"2\"/></g></g></svg>')"}} />
      
      <Card className="relative shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 rounded-3xl" />
        <div className="absolute inset-[1px] bg-white rounded-3xl" />
        
        <CardContent className="relative p-6 sm:p-8 lg:p-10">
          {/* Message d'avertissement pour carte en attente */}
          {isPendingPayment && (
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-lg">⏳</span>
                </div>
                <div>
                  <h4 className="text-orange-800 font-semibold text-sm sm:text-base">Carte en attente d'activation</h4>
                  <p className="text-xs sm:text-sm text-orange-700 mt-1">
                    Votre carte est visible mais le partage et le QR code seront disponibles après validation par un administrateur.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Photo de profil et informations principales */}
            <div className="flex flex-col items-center text-center lg:text-left w-full lg:w-auto">
              
              <div 
                className="cursor-pointer transition-all duration-300 hover:scale-105 group relative mb-6"
                onClick={() => setIsProfileImageDialogOpen(true)}
                title="Cliquer pour voir le profil en grand"
              >
                <div className="relative">
                  {/* Ring animé */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30 group-hover:opacity-60 transition-all duration-300 animate-pulse" />
                  
                  <RobustAvatar 
                    src={mcard.profile_picture_url} 
                    alt={mcard.full_name || 'Profile picture'}
                    fallbackText={mcard.full_name || ''}
                    className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 shadow-2xl ring-4 ring-white group-hover:ring-6 transition-all duration-300 text-2xl sm:text-3xl lg:text-4xl"
                  />
                  
                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Voir le profil</span>
                  </div>
                </div>
              </div>
              
              {/* Nom et badge de vérification */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-center sm:text-left leading-tight">
                  {mcard.full_name}
                </h1>
                <MCardVerifiedBadge isVerified={mcard.is_verified || false} />
              </div>
              
              {/* Titre du poste */}
              {mcard.job_title && (
                <div className="flex items-center justify-center lg:justify-start gap-3 text-gray-600 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-base sm:text-lg font-medium text-center lg:text-left">{mcard.job_title}</span>
                </div>
              )}
              
              {/* Entreprise */}
              {mcard.company && (
                <div className="flex items-center justify-center lg:justify-start gap-3 text-gray-600 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-base sm:text-lg font-medium text-center lg:text-left">{mcard.company}</span>
                </div>
              )}

              {/* Badges de statut */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700">
                  Plan {mcard.plan === 'essential' ? 'Essentiel' : mcard.plan === 'premium' ? 'Premium' : mcard.plan}
                </Badge>
                {mcard.subscription_status && (
                  <Badge 
                    variant={mcard.subscription_status === 'active' ? 'default' : 'secondary'}
                    className={`px-4 py-2 text-sm font-medium ${
                      mcard.subscription_status === 'active' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200'
                    }`}
                  >
                    {mcard.subscription_status === 'active' ? '✅ Actif' : 
                     mcard.subscription_status === 'pending_payment' ? '⏳ En attente' : 
                     mcard.subscription_status}
                  </Badge>
                )}
                {mcard.verification_status === 'pending' && (
                  <Badge className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200">
                    🔄 Vérification en cours
                  </Badge>
                )}
              </div>

              {/* Bouton de demande de vérification */}
              {canRequestVerification && (
                <Button
                  onClick={() => setIsVerificationDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 mb-6 w-full sm:w-auto"
                  size="lg"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Demander la vérification (5 000 FCFA)
                </Button>
              )}
            </div>

            {/* Informations de contact et actions */}
            <div className="flex-1 w-full min-w-0 space-y-6">
              {/* Informations de contact avec design amélioré */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-100 shadow-sm">
                <MCardViewContactInfo mcard={mcard} />
              </div>
              
              {/* Description */}
              {mcard.description && (
                <div className="bg-gradient-to-br from-purple-50/30 to-pink-50/30 rounded-2xl p-6 border border-purple-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-lg">📝</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">À propos</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{mcard.description}</p>
                </div>
              )}

              {/* Actions rapides */}
              <div className="bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl p-6 border border-blue-100 shadow-sm">
                <MCardViewQuickActions 
                  onCopyLink={handleCopyLink} 
                  onShare={handleShare}
                  disabled={isPendingPayment}
                />
              </div>

              {/* Boutons d'interaction */}
              {!isOwner && !isPendingPayment && (
                <div className="bg-gradient-to-br from-pink-50/30 to-rose-50/30 rounded-2xl p-6 border border-pink-100 shadow-sm">
                  <MCardInteractionButtons
                    mcardId={mcard.id}
                    mcardOwnerId={mcard.user_id}
                    mcardOwnerName={mcard.full_name}
                    className="justify-center"
                  />
                </div>
              )}

              {/* Bouton pour envoyer un message (cartes en attente) */}
              {!isOwner && isPendingPayment && (
                <div className="bg-gradient-to-br from-orange-50/30 to-amber-50/30 rounded-2xl p-6 border border-orange-100 shadow-sm">
                  <Button
                    onClick={() => setIsMessageDialogOpen(true)}
                    variant="outline"
                    className="w-full bg-white/80 hover:bg-white border-orange-200 text-orange-700 hover:text-orange-800 shadow-sm"
                    size="lg"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Envoyer un message
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="mt-8 bg-gradient-to-br from-indigo-50/30 to-blue-50/30 rounded-2xl p-6 border border-indigo-100 shadow-sm">
            <MCardSocialLinks mcard={mcard} />
          </div>

          {/* Analytics Dashboard pour les propriétaires */}
          {isOwner && (
            <div className="mt-8 bg-gradient-to-br from-emerald-50/30 to-green-50/30 rounded-2xl p-6 border border-emerald-100 shadow-sm">
              <MCardAnalyticsDashboard mcardId={mcard.id} isVerified={mcard.is_verified || false} />
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Dialog pour voir la photo de profil */}
      <MCardProfileImageDialog
        isOpen={isProfileImageDialogOpen}
        onOpenChange={setIsProfileImageDialogOpen}
        profileImageUrl={mcard.profile_picture_url}
        fullName={mcard.full_name}
        jobTitle={mcard.job_title}
        company={mcard.company}
      />
    </div>
  );
};
