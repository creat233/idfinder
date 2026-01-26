
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MCardStatus } from '@/types/mcard';
import { MCardViewStatusDialog } from './MCardViewStatusDialog';
import { MCardViewAddStatusDialog } from './MCardViewAddStatusDialog';
import { MCardViewEditStatusDialog } from './MCardViewEditStatusDialog';
import { MCardContactDialog } from '../messaging/MCardContactDialog';
import { MCardStatusCarousel } from './MCardStatusCarousel';
import { useToast } from '@/hooks/use-toast';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { countStatusesCreatedToday } from '@/utils/planLimits';

interface MCardViewStatusesProps {
  statuses: MCardStatus[];
  phoneNumber?: string;
  isOwner?: boolean;
  mcardId: string;
  mcardPlan?: string;
  mcardOwnerName?: string;
  mcardOwnerUserId?: string;
  subscriptionStatus?: string;
  onStatusesChange?: () => void;
  onOptimisticStatusAdd?: (status: any) => void;
}

export const MCardViewStatuses = ({ 
  statuses, 
  phoneNumber, 
  isOwner, 
  mcardId, 
  mcardPlan,
  mcardOwnerName,
  mcardOwnerUserId,
  subscriptionStatus,
  onStatusesChange,
  onOptimisticStatusAdd 
}: MCardViewStatusesProps) => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<MCardStatus | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<MCardStatus | null>(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactContext, setContactContext] = useState<{ type: 'status' | 'product'; title: string } | undefined>();
  const { toast } = useToast();

  const activeStatuses = statuses.filter(status => {
    if (!status.is_active) return false;
    if (!status.expires_at) return true;
    return new Date(status.expires_at) > new Date();
  });

  // Calculer les statuts créés aujourd'hui pour la limite journalière
  const statusesCreatedToday = countStatusesCreatedToday(statuses);
  
  // Utilisation correcte du hook usePlanLimits
  const { checkStatusLimit, planLimits } = usePlanLimits({ 
    plan: mcardPlan || 'free', 
    statusesCreatedToday, 
    currentProductsCount: 0 
  });

  const isPaidPlan = mcardPlan === 'premium' || mcardPlan === 'essential' || mcardPlan === 'ultimate' || mcardPlan === 'free';
  const isCardActive = subscriptionStatus === 'active' || subscriptionStatus === 'trial';
  const canAddStatus = isOwner && isPaidPlan && isCardActive;

  const handleStatusClick = (status: MCardStatus) => {
    const index = activeStatuses.findIndex(s => s.id === status.id);
    setCurrentStatusIndex(index);
    setSelectedStatus(status);
    setIsDialogOpen(true);
  };

  const handleNavigateStatus = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = currentStatusIndex > 0 ? currentStatusIndex - 1 : activeStatuses.length - 1;
      setCurrentStatusIndex(newIndex);
      setSelectedStatus(activeStatuses[newIndex]);
    } else {
      const newIndex = currentStatusIndex < activeStatuses.length - 1 ? currentStatusIndex + 1 : 0;
      setCurrentStatusIndex(newIndex);
      setSelectedStatus(activeStatuses[newIndex]);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStatus(null);
  };

  const handleAddStatus = () => {
    // Vérifier les limites avant d'ouvrir le dialog
    if (checkStatusLimit(subscriptionStatus)) {
      setIsAddDialogOpen(true);
    }
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
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mx-1 sm:mx-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            🟢 <span className="truncate">Statuts & Disponibilités</span>
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {activeStatuses.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigate(`all-statuses`, {
                    state: { statuses: activeStatuses, mcardId, ownerName: mcardOwnerName || '', isOwner }
                  });
                }}
                className="text-purple-600 border-purple-600 hover:bg-purple-50 text-xs sm:text-sm h-8 sm:h-9"
              >
                <span className="hidden xs:inline">Voir tout</span>
                <span className="xs:hidden">Tout</span>
              </Button>
            )}
            {canAddStatus && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                  {statusesCreatedToday}/{planLimits.maxStatuses}
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleAddStatus}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Ajouter</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {activeStatuses.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            {canAddStatus ? (
              <div>
                <p className="mb-4 text-sm sm:text-base">Aucun statut actif</p>
                <Button onClick={handleAddStatus} className="bg-blue-600 hover:bg-blue-700 text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un statut
                </Button>
              </div>
            ) : (
              <p className="text-sm sm:text-base">Aucun statut actif</p>
            )}
          </div>
        ) : (
          <div className="max-h-80 sm:max-h-96 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 -mx-1 px-1">
            <MCardStatusCarousel
              statuses={activeStatuses}
              isOwner={isOwner}
              currentIndex={currentStatusIndex}
              onIndexChange={setCurrentStatusIndex}
              onStatusClick={handleStatusClick}
              onEditStatus={handleEditStatus}
              onShareStatus={handleShareStatus}
              onContactOwner={(status) => {
                setContactContext({
                  type: 'status',
                  title: status.status_text
                });
                setIsContactDialogOpen(true);
              }}
              mcardId={mcardId}
            />
          </div>
        )}
      </div>

      <MCardViewStatusDialog
        status={selectedStatus}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        phoneNumber={phoneNumber}
        allStatuses={activeStatuses}
        currentIndex={currentStatusIndex}
        onNavigate={handleNavigateStatus}
        mcardId={mcardId}
        mcardOwnerName={mcardOwnerName}
        mcardOwnerUserId={mcardOwnerUserId}
        isOwner={isOwner}
      />

      {canAddStatus && (
        <MCardViewAddStatusDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          mcardId={mcardId}
          onStatusAdded={handleStatusAdded}
          onOptimisticStatusAdd={onOptimisticStatusAdd}
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

      {!isOwner && mcardOwnerUserId && mcardOwnerName && (
        <MCardContactDialog
          isOpen={isContactDialogOpen}
          onClose={() => setIsContactDialogOpen(false)}
          mcardId={mcardId}
          mcardOwnerName={mcardOwnerName}
          recipientId={mcardOwnerUserId}
          context={contactContext}
        />
      )}
    </>
  );
};
