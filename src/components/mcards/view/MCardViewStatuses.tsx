
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Edit, Share2, MessageCircle, Send, Sparkles } from 'lucide-react';
import { MCardStatus } from '@/types/mcard';
import { MCardViewStatusDialog } from './MCardViewStatusDialog';
import { MCardViewAddStatusDialog } from './MCardViewAddStatusDialog';
import { MCardViewEditStatusDialog } from './MCardViewEditStatusDialog';
import { StatusImageModal } from './StatusImageModal';
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<MCardStatus | null>(null);
  const { toast } = useToast();

  const activeStatuses = statuses.filter(status => {
    if (!status.is_active) return false;
    if (!status.expires_at) return true;
    return new Date(status.expires_at) > new Date();
  });

  const isPremium = mcardPlan === 'premium';
  const canAddStatus = isOwner && isPremium;

  const handleStatusClick = (status: MCardStatus) => {
    setSelectedStatus(status);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStatus(null);
  };

  const handleAddStatus = () => {
    setIsAddDialogOpen(true);
  };

  const handleStatusAdded = () => {
    onStatusesChange?.();
  };

  const handleEditStatus = (status: MCardStatus) => {
    setEditingStatus(status);
    setIsEditDialogOpen(true);
  };

  const handleStatusUpdated = () => {
    onStatusesChange?.();
    setEditingStatus(null);
  };

  const handleShareStatus = (status: MCardStatus) => {
    const shareText = `Statut: ${status.status_text} - ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Statut partagé',
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

  const handleWhatsAppShare = (status: MCardStatus) => {
    const message = encodeURIComponent(`Statut: ${status.status_text} - ${window.location.href}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (activeStatuses.length === 0 && !canAddStatus) return null;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mx-2 sm:mx-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            🟢 Statuts & Disponibilités
          </h3>
          {canAddStatus && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleAddStatus}
              className="text-blue-600 border-blue-600 hover:bg-blue-50 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter un statut
            </Button>
          )}
        </div>

        {activeStatuses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {canAddStatus ? (
              <div>
                <p className="mb-4">Aucun statut actif pour le moment</p>
                <Button onClick={handleAddStatus} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter votre premier statut
                </Button>
              </div>
            ) : (
              <p>Aucun statut actif pour le moment</p>
            )}
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
                  className="border rounded-xl p-3 sm:p-4 md:p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 md:gap-6">
                    {status.status_image && (
                      <StatusImageModal 
                        imageUrl={status.status_image}
                        statusText={status.status_text}
                      >
                        <div className="relative group">
                          <img 
                            src={status.status_image} 
                            alt={status.status_text}
                            className="w-full sm:w-20 md:w-24 h-32 sm:h-20 md:h-24 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                            onError={(e) => {
                              console.error('Error loading status image:', status.status_image);
                              e.currentTarget.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log('Status image loaded successfully:', status.status_image);
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            Cliquer pour agrandir
                          </div>
                        </div>
                      </StatusImageModal>
                    )}
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge 
                          className="text-white font-medium cursor-pointer hover:scale-105 transition-transform shadow-lg"
                          style={{ backgroundColor: status.status_color }}
                          onClick={() => handleStatusClick(status)}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {status.status_text}
                        </Badge>
                      </div>
                      
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

                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {/* Boutons de partage améliorés */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShareStatus(status)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:scale-105 transition-all shadow-sm"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Partager
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWhatsAppShare(status)}
                        className="text-green-600 border-green-600 hover:bg-green-50 hover:scale-105 transition-all shadow-sm"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>

                      {isOwner && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEditStatus(status)}
                          className="hover:bg-gray-100 hover:scale-105 transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MCardViewStatusDialog
        status={selectedStatus}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        phoneNumber={phoneNumber}
      />

      {canAddStatus && (
        <MCardViewAddStatusDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          mcardId={mcardId}
          onStatusAdded={handleStatusAdded}
        />
      )}

      {isOwner && (
        <MCardViewEditStatusDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          status={editingStatus}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </>
  );
};
