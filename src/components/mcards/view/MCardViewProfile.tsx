
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
import { MCardProfileEditor } from "../MCardProfileEditor";
import { MCard } from "@/types/mcard";
import { MCardInteractionButtons } from "../MCardInteractionButtons";
import { MCardRealtimeChat } from "../features/MCardRealtimeChat";
import { MCardAppointmentBooking } from "../features/MCardAppointmentBooking";
import { MCardRecommendations } from "../features/MCardRecommendations";
import { MCardAvailabilityManager } from "../features/MCardAvailabilityManager";
import { MCardAIAssistant } from "../features/MCardAIAssistant";
import { Mail, Phone, Globe, MapPin, Briefcase, Building, CheckCircle, MessageCircle, Edit, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MCardViewProfileProps {
  mcard: MCard;
  onCopyLink: () => void;
  onShare: () => void;
  isOwner: boolean;
}


export const MCardViewProfile = ({ mcard, onCopyLink, onShare, isOwner }: MCardViewProfileProps) => {
  const { user } = useAuth();
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isProfileImageDialogOpen, setIsProfileImageDialogOpen] = useState(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [currentProfileImage, setCurrentProfileImage] = useState(mcard.profile_picture_url);
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
        
        <CardContent className="relative p-4 sm:p-6 lg:p-8">
          {/* Message d'avertissement pour carte en attente */}
          {isPendingPayment && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl sm:rounded-2xl shadow-sm">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 text-sm sm:text-lg">⏳</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-orange-800 font-semibold text-xs sm:text-sm lg:text-base leading-tight">Carte en attente d'activation</h4>
                  <p className="text-xs sm:text-sm text-orange-700 mt-1 leading-relaxed">
                    Votre carte est visible mais le partage et le QR code seront disponibles après validation par un administrateur.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8 lg:gap-12">
            {/* Photo de profil et informations principales */}
            <div className="flex flex-col items-center text-center lg:text-left w-full lg:w-auto">
              
              <div 
                className="cursor-pointer transition-all duration-300 hover:scale-105 group relative mb-4 sm:mb-6"
                onClick={() => setIsProfileImageDialogOpen(true)}
                title="Cliquer pour voir le profil en grand"
              >
                <div className="relative">
                  {/* Ring animé */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30 group-hover:opacity-60 transition-all duration-300 animate-pulse" />
                  
                  <RobustAvatar 
                    src={currentProfileImage} 
                    alt={mcard.full_name || 'Profile picture'}
                    fallbackText={mcard.full_name || ''}
                    className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 shadow-2xl ring-2 sm:ring-4 ring-white group-hover:ring-4 sm:group-hover:ring-6 transition-all duration-300 text-lg sm:text-2xl lg:text-4xl"
                  />
                  
                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-medium px-2">{isOwner ? 'Modifier' : 'Voir le profil'}</span>
                  </div>
                  
                  {/* Bouton d'édition pour le propriétaire */}
                  {isOwner && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProfileEditorOpen(true);
                      }}
                      className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 rounded-full w-6 h-6 sm:w-8 sm:h-8 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Nom et badge de vérification */}
              <div className="flex flex-col items-center gap-2 sm:gap-3 mb-3 sm:mb-4 w-full">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-center leading-tight break-words max-w-full">
                  {mcard.full_name}
                </h1>
                <MCardVerifiedBadge isVerified={mcard.is_verified || false} />
              </div>
              
              {/* Titre du poste */}
              {mcard.job_title && (
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-gray-600 mb-2 sm:mb-3 w-full">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium text-center break-words">{mcard.job_title}</span>
                </div>
              )}
              
              {/* Entreprise */}
              {mcard.company && (
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-gray-600 mb-4 sm:mb-6 w-full">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium text-center break-words">{mcard.company}</span>
                </div>
              )}

              {/* Badges de statut */}
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 max-w-full">
                <Badge variant="outline" className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700">
                  Plan {mcard.plan === 'essential' ? 'Essentiel' : mcard.plan === 'premium' ? 'Premium' : mcard.plan}
                </Badge>
                {mcard.subscription_status && (
                  <Badge 
                    variant={mcard.subscription_status === 'active' ? 'default' : 'secondary'}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium ${
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
                  <Badge className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200">
                    🔄 Vérification en cours
                  </Badge>
                )}
              </div>

              {/* Bouton de demande de vérification */}
              {canRequestVerification && (
                <Button
                  onClick={() => setIsVerificationDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 mb-4 sm:mb-6 w-full sm:w-auto text-xs sm:text-sm"
                  size="sm"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span className="hidden sm:inline">Demander la vérification (5 000 FCFA)</span>
                  <span className="sm:hidden">Vérification (5 000 FCFA)</span>
                </Button>
              )}
            </div>

            {/* Informations de contact et actions */}
            <div className="flex-1 w-full min-w-0 space-y-4 sm:space-y-6">
              {/* Informations de contact avec design amélioré */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                <MCardViewContactInfo mcard={mcard} />
              </div>
              
              {/* Description */}
              {mcard.description && (
                <div className="bg-gradient-to-br from-purple-50/30 to-pink-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-100 shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-sm sm:text-lg">📝</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">À propos</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">{mcard.description}</p>
                </div>
              )}

              {/* Actions rapides */}
              <div className="bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100 shadow-sm">
                <MCardViewQuickActions 
                  onCopyLink={handleCopyLink} 
                  onShare={handleShare}
                  disabled={isPendingPayment}
                />
              </div>

              {/* Boutons d'interaction (visibles pour tous les visiteurs) */}
              {!isOwner && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-pink-50/30 to-rose-50/30 rounded-2xl p-6 border border-pink-100 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-pink-600">💕</span>
                      Interactions
                    </h4>
                    <MCardInteractionButtons
                      mcardId={mcard.id}
                      mcardOwnerId={mcard.user_id}
                      mcardOwnerName={mcard.full_name}
                      className="justify-center"
                    />
                  </div>
                  
                  {/* Actions disponibles pour tous les visiteurs */}
                  <div className="bg-gradient-to-br from-green-50/30 to-emerald-50/30 rounded-2xl p-6 border border-green-100 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4">🚀 Actions disponibles</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <MCardAppointmentBooking
                        mcardId={mcard.id}
                        mcardOwnerId={mcard.user_id}
                        mcardOwnerName={mcard.full_name}
                        phoneNumber={mcard.phone_number}
                      />
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg">
                        💾 Sauvegarder hors-ligne
                      </Button>
                    </div>
                  </div>
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
          <div className="mt-6 sm:mt-8 bg-gradient-to-br from-indigo-50/30 to-blue-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-100 shadow-sm">
            <MCardSocialLinks mcard={mcard} />
          </div>

          {/* Fonctionnalités avancées pour les propriétaires */}
          {isOwner && (
            <div className="space-y-4 sm:space-y-6">
              <MCardAnalyticsDashboard mcardId={mcard.id} mcardSlug={mcard.slug} />
              
              <div className="bg-gradient-to-br from-purple-50/30 to-pink-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-100 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="text-lg sm:text-xl">🚀</span> 
                  <span className="break-words">Fonctionnalités avancées</span>
                </h3>
                
                {/* Bouton de gestion des factures avec design élégant */}
                <div className="mb-4 sm:mb-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-300 group">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0">
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm lg:text-base break-words">Gestion des factures</h4>
                          <p className="text-xs text-gray-600 break-words">Créez et gérez vos factures professionnelles</p>
                        </div>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto text-xs sm:text-sm"
                        size="sm"
                        onClick={() => {
                          // Navigation vers la page de factures
                          window.location.href = `/mcard/${mcard.slug}/invoices`;
                        }}
                      >
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        <span className="hidden sm:inline">Créer une facture</span>
                        <span className="sm:hidden">Créer facture</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Autres fonctionnalités */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <MCardAvailabilityManager mcardId={mcard.id} isOwner={isOwner} />
                  <MCardAIAssistant mcard={mcard} isOwner={isOwner} />
                </div>
              </div>
            </div>
          )}

          {/* Recommandations pour les visiteurs */}
          {!isOwner && !isPendingPayment && (
            <div className="mt-8">
              <MCardRecommendations currentMCardId={mcard.id} />
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
        profileImageUrl={currentProfileImage}
        fullName={mcard.full_name}
        jobTitle={mcard.job_title}
        company={mcard.company}
      />

      {/* Dialog pour modifier la photo de profil */}
      <MCardProfileEditor
        isOpen={isProfileEditorOpen}
        onOpenChange={setIsProfileEditorOpen}
        mcardId={mcard.id}
        currentImageUrl={currentProfileImage}
        onImageUpdated={setCurrentProfileImage}
      />

      {/* Chat en temps réel pour les visiteurs connectés */}
      {!isOwner && user && !isPendingPayment && (
        <MCardRealtimeChat
          mcardId={mcard.id}
          mcardOwnerId={mcard.user_id}
          mcardOwnerName={mcard.full_name}
          currentUserId={user.id}
          currentUserName={user.user_metadata?.first_name || 'Visiteur'}
        />
      )}
    </div>
  );
};
