
import { Button } from "@/components/ui/button";
import { Edit, QrCode, Share2, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface MCardViewHeaderProps {
  isOwner: boolean;
  showQRCode: boolean;
  viewCount: number;
  subscriptionStatus?: string;
  onEdit: () => void;
  onToggleQRCode: () => void;
  onShare: () => void;
}

export const MCardViewHeader = ({ 
  isOwner, 
  showQRCode, 
  viewCount,
  subscriptionStatus,
  onEdit, 
  onToggleQRCode, 
  onShare 
}: MCardViewHeaderProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isPendingPayment = subscriptionStatus === 'pending_payment';

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="w-full px-2 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Logo FinderID avec bouton retour */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
            )}
            <div className="flex items-center space-x-1 sm:space-x-2 cursor-pointer min-w-0" onClick={() => window.open('https://finderid.info', '_blank')}>
              <img 
                src="/lovable-uploads/4f1d2be2-319b-4f55-8aa0-54813e8045c5.png" 
                alt="FinderID Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900 truncate">FinderID</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Message d'attente si en pending_payment */}
            {isPendingPayment && (
              <div className="bg-orange-100 border border-orange-200 rounded-lg px-2 sm:px-3 py-1 sm:py-2 w-full sm:w-auto">
                <span className="text-xs sm:text-sm text-orange-800 font-medium block">
                  ⏳ Carte en attente d'activation
                </span>
              </div>
            )}

            {/* Compteur de vues - visible pour toutes les cartes */}
            <div className="flex items-center gap-1 text-gray-600">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{viewCount.toLocaleString()} vues</span>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto overflow-x-auto">
              {isOwner && (
                <Button variant="outline" size="sm" onClick={onEdit} className="flex-shrink-0">
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Modifier</span>
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={onToggleQRCode}
                disabled={isPendingPayment}
                title={isPendingPayment ? "QR Code disponible après activation" : "Afficher le QR Code"}
                className="flex-shrink-0"
              >
                <QrCode className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">QR Code</span>
              </Button>
              <Button 
                size="sm"
                onClick={onShare}
                disabled={isPendingPayment}
                title={isPendingPayment ? "Partage disponible après activation" : "Partager la carte"}
                className="flex-shrink-0"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Partager</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
