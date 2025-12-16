
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

export const PublicHeaderMobileNav = ({ user, isMenuOpen, onSignOut, onGetStarted, onClose }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200">
      <nav className="py-4 space-y-2">
        {/* Section Identité */}
        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">🪪 Cartes d'identité</p>
          <div className="space-y-2 pl-2">
            <button 
              onClick={() => { navigate("/rechercher"); onClose(); }}
              className="block text-left text-gray-600 hover:text-[#7E69AB] w-full"
            >
              🔍 Rechercher une carte perdue
            </button>
            <button 
              onClick={() => { navigate("/signaler"); onClose(); }}
              className="block text-left text-gray-600 hover:text-[#7E69AB] w-full"
            >
              📢 Signaler une carte trouvée
            </button>
            <button 
              onClick={() => { navigate("/urgence"); onClose(); }}
              className="block text-left text-gray-600 hover:text-[#7E69AB] w-full"
            >
              🚨 Numéros d'urgence
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 mx-4"></div>

        {/* Section MCard */}
        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">💳 Cartes de visite MCard</p>
          <div className="space-y-2 pl-2">
            <button 
              onClick={() => { navigate("/mcards"); onClose(); }}
              className="block text-left text-gray-600 hover:text-[#7E69AB] w-full"
            >
              ✨ Créer ma carte de visite
            </button>
            <button 
              onClick={() => { navigate("/verified-mcards"); onClose(); }}
              className="block text-left text-gray-600 hover:text-[#7E69AB] w-full font-medium"
            >
              ✅ Services & prestataires vérifiés
            </button>
            <a href="/#tarifs" className="block text-gray-600 hover:text-[#7E69AB]" onClick={onClose}>
              💰 Voir les tarifs MCard
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100 mx-4"></div>

        {/* Section Générale */}
        <div className="px-4 py-2">
          <div className="space-y-2">
            <button 
              onClick={() => { navigate("/about"); onClose(); }}
              className="block text-left text-gray-600 hover:text-[#7E69AB] w-full"
            >
              ℹ️ À propos de FinderID
            </button>
            <button 
              onClick={() => { navigate("/demo"); onClose(); }}
              className="block text-left text-gray-600 hover:text-[#7E69AB] w-full"
            >
              🎬 Voir la démo
            </button>
          </div>
        </div>

        {user && (
          <>
            <div className="border-t border-gray-100 mx-4"></div>
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">👤 Mon compte</p>
              <div className="space-y-2 pl-2">
                <button 
                  onClick={() => { navigate("/mes-cartes"); onClose(); }}
                  className="block text-left text-gray-600 hover:text-[#7E69AB] w-full"
                >
                  {t('myCards')}
                </button>
                <button
                  onClick={() => { navigate("/notifications"); onClose(); }}
                  className="block text-left text-gray-600 hover:text-[#7E69AB] w-full"
                >
                  {t('notifications')}
                </button>
              </div>
            </div>
          </>
        )}
        <div className="px-4 pt-4 space-y-2">
          {user ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => { navigate("/profile"); onClose(); }}
                className="w-full"
              >
                <User className="mr-2 h-4 w-4" />
                {t('profile')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => { onSignOut(); onClose(); }}
                className="w-full text-red-600 border-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('logout')}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => { navigate("/login"); onClose(); }}
                className="w-full"
              >
                {t('login')}
              </Button>
              <Button 
                onClick={() => { navigate("/mcards"); onClose(); }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white"
              >
                ✨ Créer ma carte MCard
              </Button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};
