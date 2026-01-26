
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
    <div className="bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 shadow-lg border-b border-blue-100/50 sticky top-0 z-40">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Bouton retour */}
          <div className="flex items-center min-w-0 flex-shrink-0">
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 sm:gap-2 hover:bg-blue-100/50 text-gray-700 hover:text-blue-700 transition-all duration-200 px-2 sm:px-3"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden xs:inline font-medium text-sm">Retour</span>
              </Button>
            )}
          </div>

          {/* Contenu central - message d'attente */}
          {isPendingPayment && (
            <div className="hidden sm:flex bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-lg px-3 py-1.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-orange-600 text-sm">⏳</span>
                <span className="text-xs sm:text-sm text-orange-800 font-medium whitespace-nowrap">
                  En attente d'activation
                </span>
              </div>
            </div>
          )}

          {/* Actions à droite */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Compteur de vues - compact sur mobile */}
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm border border-gray-200">
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">{viewCount >= 1000 ? `${(viewCount/1000).toFixed(1)}k` : viewCount}</span>
            </div>

            {/* Boutons d'action - icônes seules sur mobile */}
            {isOwner && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEdit} 
                className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3 bg-white/80 hover:bg-blue-50 border-blue-200 text-blue-700 shadow-sm transition-all active:scale-95"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline ml-2 font-medium">Modifier</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleQRCode}
              disabled={isPendingPayment}
              className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3 bg-white/80 hover:bg-purple-50 border-purple-200 text-purple-700 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline ml-2 font-medium">QR</span>
            </Button>
            <Button 
              size="sm"
              onClick={onShare}
              disabled={isPendingPayment}
              className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline ml-2 font-medium">Partager</span>
            </Button>
          </div>
        </div>

        {/* Message d'attente mobile */}
        {isPendingPayment && (
          <div className="sm:hidden mt-2 bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-lg px-3 py-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-orange-600 text-sm">⏳</span>
              <span className="text-xs text-orange-800 font-medium">Carte en attente d'activation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
