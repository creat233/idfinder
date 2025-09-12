
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
    <div className="bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 shadow-lg border-b border-blue-100/50">
      <div className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          {/* Logo FinderID avec bouton retour */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 hover:bg-blue-100/50 text-gray-700 hover:text-blue-700 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Retour</span>
              </Button>
            )}
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0 group" onClick={() => window.open('https://finderid.info', '_blank')}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <img 
                  src="/lovable-uploads/4f1d2be2-319b-4f55-8aa0-54813e8045c5.png" 
                  alt="FinderID Logo" 
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">FinderID</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Message d'attente si en pending_payment */}
            {isPendingPayment && (
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-xl px-4 py-2 w-full sm:w-auto shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-sm">⏳</span>
                  </div>
                  <span className="text-sm text-orange-800 font-semibold">
                    Carte en attente d'activation
                  </span>
                </div>
              </div>
            )}

            {/* Compteur de vues */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-gray-200">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="h-3 w-3 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{viewCount.toLocaleString()} vues</span>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {isOwner && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onEdit} 
                  className="flex-shrink-0 bg-white/80 hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Edit className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline font-medium">Modifier</span>
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={onToggleQRCode}
                disabled={isPendingPayment}
                title={isPendingPayment ? "QR Code disponible après activation" : "Afficher le QR Code"}
                className="flex-shrink-0 bg-white/80 hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
              >
                <QrCode className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline font-medium">QR Code</span>
              </Button>
              <Button 
                size="sm"
                onClick={onShare}
                disabled={isPendingPayment}
                title={isPendingPayment ? "Partage disponible après activation" : "Partager la carte"}
                className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <Share2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline font-medium">Partager</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
