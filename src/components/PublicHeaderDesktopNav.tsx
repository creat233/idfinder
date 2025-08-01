
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
      <nav className="hidden md:flex items-center space-x-8">
        <a href="/#fonctionnalites" className="text-gray-600 hover:text-[#7E69AB] transition-colors">
          {t('features')}
        </a>
        <a href="/#tarifs" className="text-gray-600 hover:text-[#7E69AB] transition-colors">
          {t('pricing')}
        </a>
        <button 
          onClick={() => navigate("/demo")}
          className="text-gray-600 hover:text-[#7E69AB] transition-colors"
        >
          {t('demo')}
        </button>
        <button 
          onClick={() => navigate("/urgence")}
          className="text-gray-600 hover:text-[#7E69AB] transition-colors"
        >
          {t('emergencyNumbersLink')}
        </button>
        <button 
          onClick={() => navigate("/about")}
          className="text-gray-600 hover:text-[#7E69AB] transition-colors"
        >
          {t('about')}
        </button>
        <button 
          onClick={() => navigate("/verified-mcards")}
          className="text-gray-600 hover:text-[#7E69AB] transition-colors"
        >
          MCards Vérifiées
        </button>
        <button 
          onClick={() => navigate("/demo?cardNumber=123456")}
          className="text-gray-600 hover:text-[#7E69AB] transition-colors font-medium border border-gray-300 px-3 py-1 rounded-md"
        >
          Tester : 123456
        </button>
        {user && (
          <button 
            onClick={() => navigate("/mes-cartes")}
            className="text-gray-600 hover:text-[#7E69AB] transition-colors"
          >
            {t('myCards')}
          </button>
        )}
        {user && (
          <button
            onClick={() => navigate("/notifications")}
            className="text-gray-600 hover:text-[#7E69AB] transition-colors"
          >
            {t('notifications')}
          </button>
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
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white hover:opacity-90"
            >
              {t('getStartedNow')}
            </Button>
          </>
        )}
      </div>
    </>
  );
};
