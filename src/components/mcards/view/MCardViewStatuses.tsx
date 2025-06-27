
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, Clock, X, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { MCardStatus } from "@/types/mcard";
import { MCardViewStatusDialog } from "./MCardViewStatusDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MCardViewStatusesProps {
  statuses: MCardStatus[];
  phoneNumber?: string | null;
  isOwner: boolean;
  mcardId?: string;
  mcardPlan?: string;
  onStatusesChange?: () => void;
}

export const MCardViewStatuses = ({ 
  statuses, 
  phoneNumber, 
  isOwner, 
  mcardId,
  mcardPlan,
  onStatusesChange
}: MCardViewStatusesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleStatusContact = (status: MCardStatus) => {
    if (!phoneNumber) return;
    
    const message = `Bonjour ! Je suis intéressé(e) par votre statut "${status.status_text}". Pourriez-vous me donner plus d'informations ?`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareStatus = (status: MCardStatus, platform: string) => {
    const baseUrl = window.location.origin;
    const cardUrl = window.location.href;
    const shareText = `Découvrez mon statut: "${status.status_text}" sur ma carte de visite digitale`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cardUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(cardUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cardUrl)}&title=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${cardUrl}`)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: shareText,
            text: shareText,
            url: cardUrl
          });
          return;
        }
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    toast({
      title: "Partage du statut",
      description: "Votre statut a été partagé !"
    });
  };

  const handleDeleteStatus = async (statusId: string) => {
    try {
      const { error } = await supabase
        .from('mcard_statuses')
        .delete()
        .eq('id', statusId);

      if (error) throw error;

      toast({
        title: "Statut supprimé",
        description: "Le statut a été supprimé avec succès."
      });

      if (onStatusesChange) {
        onStatusesChange();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le statut."
      });
    }
  };

  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    
    const now = new Date();
    const expiration = new Date(expiresAt);
    const diffMs = expiration.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (hours <= 0) return "Expiré";
    if (hours < 24) return `${hours}h restantes`;
    return "24h";
  };

  const canAddStatus = isOwner && mcardPlan === 'premium' && statuses.length < 9;

  if (statuses.length === 0 && !isOwner) {
    return null;
  }

  return (
    <>
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Statuts & Disponibilités
            </CardTitle>
            {canAddStatus && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsDialogOpen(true)}
                className="bg-white/50 hover:bg-white/80 backdrop-blur-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            )}
          </div>
          {isOwner && mcardPlan !== 'premium' && (
            <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">
              🔒 Plan Premium requis pour ajouter des statuts
            </p>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {statuses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
              <p>Aucun statut défini</p>
              {canAddStatus && (
                <p className="text-sm mt-2">Cliquez sur "Ajouter" pour créer votre premier statut</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statuses.map((status) => (
                <div 
                  key={status.id} 
                  className="border-0 rounded-xl p-4 space-y-3 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-100 hover:bg-red-200 rounded-full z-10"
                      onClick={() => handleDeleteStatus(status.id)}
                    >
                      <X className="h-3 w-3 text-red-600" />
                    </Button>
                  )}
                  
                  {/* Image du statut */}
                  {status.status_image && (
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                      <img 
                        src={status.status_image} 
                        alt={status.status_text}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      style={{ backgroundColor: status.status_color, color: 'white' }}
                      className="text-xs px-3 py-1 rounded-full shadow-lg"
                    >
                      {status.status_text}
                    </Badge>
                  </div>
                  
                  {/* Temps restant */}
                  {status.expires_at && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      <Clock className="h-3 w-3" />
                      {getTimeRemaining(status.expires_at)}
                    </div>
                  )}
                  
                  {/* Boutons d'action */}
                  <div className="space-y-2">
                    {!isOwner && phoneNumber && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusContact(status)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contacter
                      </Button>
                    )}
                    
                    {/* Boutons de partage */}
                    <div className="flex justify-center">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareStatus(status, 'whatsapp')}
                          className="h-8 w-8 p-0 bg-green-50 hover:bg-green-100 border-green-200"
                          title="Partager sur WhatsApp"
                        >
                          <MessageCircle className="h-3 w-3 text-green-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareStatus(status, 'facebook')}
                          className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200"
                          title="Partager sur Facebook"
                        >
                          <Facebook className="h-3 w-3 text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareStatus(status, 'twitter')}
                          className="h-8 w-8 p-0 bg-gray-50 hover:bg-gray-100 border-gray-200"
                          title="Partager sur Twitter"
                        >
                          <Twitter className="h-3 w-3 text-gray-900" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareStatus(status, 'linkedin')}
                          className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200"
                          title="Partager sur LinkedIn"
                        >
                          <Linkedin className="h-3 w-3 text-blue-700" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!phoneNumber && !isOwner && statuses.length > 0 && (
            <p className="text-center text-gray-500 mt-4 text-sm bg-gray-50 p-3 rounded-lg">
              Numéro de téléphone non disponible pour le contact
            </p>
          )}
        </CardContent>
      </Card>

      {mcardId && (
        <MCardViewStatusDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          mcardId={mcardId}
          onStatusAdded={() => {
            if (onStatusesChange) {
              onStatusesChange();
            }
          }}
        />
      )}
    </>
  );
};
