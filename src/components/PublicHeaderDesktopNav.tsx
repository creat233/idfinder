
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

export const PublicHeaderDesktopNav = ({ user, onSignOut }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getCartCount } = useCart();

  const linkClass = "text-slate-300 hover:text-white transition-colors";

  return (
    <>
      <nav className="hidden md:flex items-center space-x-7">
        <a href="/#fonctionnalites" className={linkClass}>{t('features')}</a>
        <a href="/#tarifs" className={linkClass}>{t('pricing')}</a>
        <button onClick={() => navigate("/demo")} className={linkClass}>{t('demo')}</button>
        <button onClick={() => navigate("/urgence")} className={linkClass}>{t('emergencyNumbersLink')}</button>
        <button onClick={() => navigate("/about")} className={linkClass}>{t('about')}</button>
        <button onClick={() => navigate("/verified-mcards")}
          className="text-white font-medium px-3 py-1 rounded-md border border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20 transition-colors">
          ✅ Services
        </button>
        {user && <button onClick={() => navigate("/mes-cartes")} className={linkClass}>{t('myCards')}</button>}
        {user && <button onClick={() => navigate("/notifications")} className={linkClass}>{t('notifications')}</button>}
      </nav>
      <div className="hidden md:flex items-center space-x-3">
        {user ? (
          <>
            <Button variant="ghost" onClick={() => navigate("/panier")} className="text-slate-300 hover:text-white hover:bg-white/10 relative">
              <ShoppingBag className="mr-2 h-4 w-4" />Panier
              {getCartCount() > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {getCartCount()}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" onClick={() => navigate("/profile")} className="text-slate-300 hover:text-white hover:bg-white/10">
              <User className="mr-2 h-4 w-4" />{t('profile')}
            </Button>
            <Button variant="ghost" onClick={onSignOut} className="text-slate-300 hover:text-red-400 hover:bg-white/5">
              <LogOut className="mr-2 h-4 w-4" />{t('logout')}
            </Button>
          </>
        ) : (
          <Button variant="ghost" onClick={() => navigate("/login")} className="text-slate-300 hover:text-white hover:bg-white/10">
            {t('login')}
          </Button>
        )}
      </div>
    </>
  );
};
