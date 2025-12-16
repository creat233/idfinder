
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useTranslation } from "@/hooks/useTranslation";
import { useCart } from "@/contexts/CartContext";

type Props = {
  user: SupabaseUser | null;
  onSignOut: () => void;
  onGetStarted: () => void;
};

export const PublicHeaderDesktopNav = ({ user, onSignOut, onGetStarted }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getCartCount } = useCart();

  console.log('🔍 PublicHeaderDesktopNav - État utilisateur:', { user: !!user, userEmail: user?.email });

  return (
    <>
      <nav className="hidden md:flex items-center space-x-6">
        {/* Section Identité */}
        <div className="flex items-center space-x-4 border-r border-gray-200 pr-4">
          <button 
            onClick={() => navigate("/rechercher")}
            className="text-gray-600 hover:text-[#7E69AB] transition-colors text-sm"
          >
            🔍 Rechercher ID
          </button>
          <button 
            onClick={() => navigate("/signaler")}
            className="text-gray-600 hover:text-[#7E69AB] transition-colors text-sm"
          >
            📢 Signaler ID
          </button>
          <button 
            onClick={() => navigate("/urgence")}
            className="text-gray-600 hover:text-[#7E69AB] transition-colors text-sm"
          >
            🚨 Urgences
          </button>
        </div>
        
        {/* Section MCard */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate("/mcards")}
            className="text-gray-600 hover:text-[#7E69AB] transition-colors text-sm"
          >
            💳 Créer MCard
          </button>
          <button 
            onClick={() => navigate("/verified-mcards")}
            className="text-gray-600 hover:text-[#7E69AB] transition-colors text-sm font-medium bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-2 py-1 rounded-md hover:from-green-100 hover:to-emerald-100"
          >
            ✅ Services vérifiés
          </button>
          <button 
            onClick={() => navigate("/about")}
            className="text-gray-600 hover:text-[#7E69AB] transition-colors text-sm"
          >
            ℹ️ À propos
          </button>
        </div>

        {user && (
          <>
            <button 
              onClick={() => navigate("/mes-cartes")}
              className="text-gray-600 hover:text-[#7E69AB] transition-colors text-sm"
            >
              {t('myCards')}
            </button>
            <button
              onClick={() => navigate("/notifications")}
              className="text-gray-600 hover:text-[#7E69AB] transition-colors text-sm"
            >
              {t('notifications')}
            </button>
          </>
        )}
      </nav>
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/panier")}
              className="text-gray-600 hover:text-[#7E69AB] relative"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Panier
              {getCartCount() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {getCartCount()}
                </Badge>
              )}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/profile")}
              className="text-gray-600 hover:text-[#7E69AB]"
            >
              <User className="mr-2 h-4 w-4" />
              {t('profile')}
            </Button>
            <Button 
              variant="ghost" 
              onClick={onSignOut}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('logout')}
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")}
              className="text-gray-600 hover:text-[#7E69AB]"
            >
              {t('login')}
            </Button>
            {/* Bouton Signaler masqué */}
          </>
        )}
      </div>
    </>
  );
};
