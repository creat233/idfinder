
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useTranslation } from "@/hooks/useTranslation";

type Props = {
  user: SupabaseUser | null;
  isMenuOpen: boolean;
  onSignOut: () => void;
  onGetStarted: () => void;
  onClose: () => void;
};

export const PublicHeaderMobileNav = ({ user, isMenuOpen, onSignOut, onClose }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!isMenuOpen) return null;

  const linkClass = "block px-4 text-left text-slate-300 hover:text-white transition-colors w-full";

  return (
    <div className="md:hidden bg-[hsl(var(--vapor-ink))]/95 backdrop-blur-xl border-t border-white/10">
      <nav className="py-4 space-y-4">
        <button onClick={() => { navigate("/demo"); onClose(); }} className={linkClass}>{t('demo')}</button>
        <button onClick={() => { navigate("/urgence"); onClose(); }} className={linkClass}>{t('emergencyNumbersLink')}</button>
        <button onClick={() => { navigate("/about"); onClose(); }} className={linkClass}>{t('about')}</button>
        {user && <button onClick={() => { navigate("/mes-cartes"); onClose(); }} className={linkClass}>{t('myCards')}</button>}
        {user && <button onClick={() => { navigate("/notifications"); onClose(); }} className={linkClass}>{t('notifications')}</button>}
        <div className="px-4 pt-4 space-y-2">
          {user ? (
            <>
              <Button variant="outline" onClick={() => { navigate("/profile"); onClose(); }} className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                <User className="mr-2 h-4 w-4" />{t('profile')}
              </Button>
              <Button variant="outline" onClick={() => { onSignOut(); onClose(); }} className="w-full text-red-400 border-red-500/40 bg-red-500/10 hover:bg-red-500/20">
                <LogOut className="mr-2 h-4 w-4" />{t('logout')}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => { navigate("/login"); onClose(); }} className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                {t('login')}
              </Button>
              <Button onClick={() => { navigate("/#tarifs"); onClose(); }} className="w-full text-slate-900 font-semibold"
                style={{ background: 'linear-gradient(135deg, hsl(var(--vapor-mist)), hsl(var(--vapor-lavender)))' }}>
                📋 Voir les abonnements MCard
              </Button>
              <Button onClick={() => { navigate("/login"); onClose(); }} className="w-full text-slate-900 font-semibold"
                style={{ background: 'linear-gradient(135deg, hsl(var(--vapor-cyan)), hsl(var(--vapor-mist)))' }}>
                ✨ Créer ma carte
              </Button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};
