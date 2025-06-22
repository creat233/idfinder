
import { Button } from "@/components/ui/button";
import { Edit, QrCode, Share2, Eye } from "lucide-react";

interface MCardViewHeaderProps {
  isOwner: boolean;
  showQRCode: boolean;
  viewCount: number;
  onEdit: () => void;
  onToggleQRCode: () => void;
  onShare: () => void;
}

export const MCardViewHeader = ({ 
  isOwner, 
  showQRCode, 
  viewCount,
  onEdit, 
  onToggleQRCode, 
  onShare 
}: MCardViewHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo FinderID */}
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/4f1d2be2-319b-4f55-8aa0-54813e8045c5.png" 
              alt="FinderID Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-900">FinderID</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Compteur de vues */}
            <div className="flex items-center gap-1 text-gray-600">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{viewCount.toLocaleString()} vues</span>
            </div>

            {/* Boutons d'action */}
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
    </div>
  );
};
