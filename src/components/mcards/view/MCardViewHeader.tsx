
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, QrCode, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MCardViewHeaderProps {
  isOwner: boolean;
  showQRCode: boolean;
  onEdit: () => void;
  onToggleQRCode: () => void;
  onShare: () => void;
}

export const MCardViewHeader = ({ 
  isOwner, 
  showQRCode, 
  onEdit, 
  onToggleQRCode, 
  onShare 
}: MCardViewHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/mcards')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center gap-2">
            {isOwner && (
              <Button variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            <Button variant="outline" onClick={onToggleQRCode}>
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
            <Button onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
