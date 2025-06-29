
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Edit, Share2, MessageCircle, Eye } from 'lucide-react';
import { MCardStatus } from '@/types/mcard';
import { MCardViewStatusDialog } from './MCardViewStatusDialog';
import { useToast } from '@/hooks/use-toast';

interface MCardViewStatusesProps {
  statuses: MCardStatus[];
  phoneNumber?: string;
  isOwner?: boolean;
  mcardId: string;
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
  const [selectedStatus, setSelectedStatus] = useState<MCardStatus | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const activeStatuses = statuses.filter(status => {
    if (!status.is_active) return false;
    if (!status.expires_at) return true;
    return new Date(status.expires_at) > new Date();
  });

  const handleStatusClick = (status: MCardStatus) => {
    setSelectedStatus(status);
    setIsDialogOpen(true);
  };

  const handleImagePreview = (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(imageUrl);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStatus(null);
  };

  const handleCloseImagePreview = () => {
    setImagePreview(null);
  };

  const handleShareStatus = (status: MCardStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `🟢 Statut: ${status.status_text}\n\n📱 Voir ma mCard: ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mon Statut - FinderID',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Statut copié !",
        description: "Le statut a été copié dans le presse-papiers"
      });
    }
  };

  const handleWhatsAppShare = (status: MCardStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(`🟢 Mon statut: ${status.status_text}\n\n📱 Voir ma mCard complète: ${window.location.href}\n\n#FinderID`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = (status: MCardStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Mon statut: ${status.status_text}`);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${text}`;
    window.open(facebookUrl, '_blank');
  };

  const handleTwitterShare = (status: MCardStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`🟢 Mon statut: ${status.status_text}\n\n📱 Voir ma mCard: ${window.location.href}\n\n#FinderID`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(twitterUrl, '_blank');
  };

  if (activeStatuses.length === 0 && !isOwner) return null;

  return (
    <>
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 card-enhanced">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            🟢 Statuts & Disponibilités
          </h3>
          {isOwner && (
            <Button 
              size="sm" 
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50 w-full sm:w-auto btn-enhanced"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          )}
        </div>

        {activeStatuses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun statut actif pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeStatuses.map((status) => {
              const timeRemaining = status.expires_at ? 
                Math.max(0, Math.floor((new Date(status.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60))) : 
                null;

              return (
                <div 
                  key={status.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-all bg-white/80 backdrop-blur-sm cursor-pointer"
                  onClick={() => handleStatusClick(status)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Image du statut */}
                    {status.status_image && (
                      <div className="flex-shrink-0 relative group">
                        <img 
                          src={status.status_image} 
                          alt={status.status_text}
                          className="w-full lg:w-24 h-32 lg:h-24 object-cover rounded-lg transition-all duration-300 group-hover:scale-105"
                          onClick={(e) => handleImagePreview(status.status_image!, e)}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <Badge 
                          className="text-white font-medium w-fit px-3 py-1"
                          style={{ backgroundColor: status.status_color }}
                        >
                          {status.status_text}
                        </Badge>
                        
                        {timeRemaining !== null && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>
                              {timeRemaining > 0 
                                ? `Expire dans ${timeRemaining}h`
                                : 'Expiré'
                              }
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Boutons de partage */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleShareStatus(status, e)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50 btn-enhanced"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Partager
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleWhatsAppShare(status, e)}
                          className="text-green-600 border-green-600 hover:bg-green-50 btn-enhanced"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          WhatsApp
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleFacebookShare(status, e)}
                          className="text-blue-800 border-blue-800 hover:bg-blue-50 btn-enhanced"
                        >
                          📘 Facebook
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleTwitterShare(status, e)}
                          className="text-black border-gray-800 hover:bg-gray-50 btn-enhanced"
                        >
                          🐦 Twitter
                        </Button>

                        {isOwner && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => e.stopPropagation()}
                            className="btn-enhanced"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Prévisualisation d'image */}
      {imagePreview && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={handleCloseImagePreview}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={imagePreview} 
              alt="Aperçu" 
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              onClick={handleCloseImagePreview}
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      <MCardViewStatusDialog
        status={selectedStatus}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        phoneNumber={phoneNumber}
      />
    </>
  );
};
