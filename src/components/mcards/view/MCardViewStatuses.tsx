
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Edit } from 'lucide-react';
import { MCardStatus } from '@/types/mcard';
import { MCardViewStatusDialog } from './MCardViewStatusDialog';

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

  const activeStatuses = statuses.filter(status => {
    if (!status.is_active) return false;
    if (!status.expires_at) return true;
    return new Date(status.expires_at) > new Date();
  });

  const handleStatusClick = (status: MCardStatus) => {
    setSelectedStatus(status);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStatus(null);
  };

  if (activeStatuses.length === 0 && !isOwner) return null;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            🟢 Statuts & Disponibilités
          </h3>
          {isOwner && (
            <Button 
              size="sm" 
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
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
                  className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleStatusClick(status)}
                >
                  <div className="flex items-center gap-4">
                    {status.status_image && (
                      <img 
                        src={status.status_image} 
                        alt={status.status_text}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex-1">
                      <Badge 
                        className="text-white font-medium mb-2"
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

                    {isOwner && (
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
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
    </>
  );
};
