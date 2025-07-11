
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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo FinderID avec bouton retour */}
          <div className="flex items-center space-x-4">
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
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.open('https://finderid.info', '_blank')}>
              <img 
                src="/lovable-uploads/4f1d2be2-319b-4f55-8aa0-54813e8045c5.png" 
                alt="FinderID Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-gray-900">FinderID</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Message d'attente si en pending_payment */}
            {isPendingPayment && (
              <div className="bg-orange-100 border border-orange-200 rounded-lg px-3 py-2">
                <span className="text-sm text-orange-800 font-medium">
                  ⏳ Carte en attente d'activation
                </span>
              </div>
            )}

            {/* Compteur de vues - visible pour toutes les cartes */}
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
              <Button 
                variant="outline" 
                onClick={onToggleQRCode}
                disabled={isPendingPayment}
                title={isPendingPayment ? "QR Code disponible après activation" : "Afficher le QR Code"}
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
              <Button 
                onClick={onShare}
                disabled={isPendingPayment}
                title={isPendingPayment ? "Partage disponible après activation" : "Partager la carte"}
              >
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
