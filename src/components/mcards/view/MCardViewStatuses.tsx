
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus } from "lucide-react";
import { MCardStatus } from "@/types/mcard";

interface MCardViewStatusesProps {
  statuses: MCardStatus[];
  phoneNumber?: string | null;
  isOwner: boolean;
  onAddStatus?: () => void;
}

export const MCardViewStatuses = ({ 
  statuses, 
  phoneNumber, 
  isOwner, 
  onAddStatus 
}: MCardViewStatusesProps) => {
  const handleStatusContact = (status: MCardStatus) => {
    if (!phoneNumber) return;
    
    const message = `Bonjour ! Je suis intéressé(e) par votre statut "${status.status_text}". Pourriez-vous me donner plus d'informations ?`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (statuses.length === 0 && !isOwner) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            Statuts & Disponibilités
          </CardTitle>
          {isOwner && statuses.length < 9 && (
            <Button variant="outline" size="sm" onClick={onAddStatus}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {statuses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun statut défini</p>
            {isOwner && (
              <p className="text-sm mt-2">Cliquez sur "Ajouter" pour créer votre premier statut</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {statuses.map((status) => (
              <div 
                key={status.id} 
                className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <Badge 
                    style={{ backgroundColor: status.status_color, color: 'white' }}
                    className="text-xs"
                  >
                    {status.status_text}
                  </Badge>
                </div>
                
                {!isOwner && phoneNumber && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusContact(status)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {!phoneNumber && !isOwner && (
          <p className="text-center text-gray-500 mt-4 text-sm">
            Numéro de téléphone non disponible pour le contact
          </p>
        )}
      </CardContent>
    </Card>
  );
};
