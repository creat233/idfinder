
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";

type Props = {
  user: SupabaseUser | null;
  isMenuOpen: boolean;
  onSignOut: () => void;
  onGetStarted: () => void;
  onClose: () => void;
};

export const PublicHeaderMobileNav = ({ user, isMenuOpen, onSignOut, onGetStarted, onClose }: Props) => {
  const navigate = useNavigate();

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200">
      <nav className="py-4 space-y-4">
        <a href="/#fonctionnalites" className="block px-4 text-gray-600 hover:text-[#7E69AB]" onClick={onClose}>
          Fonctionnalités
        </a>
        <a href="/#tarifs" className="block px-4 text-gray-600 hover:text-[#7E69AB]" onClick={onClose}>
          Tarifs
        </a>
        <button 
          onClick={() => { navigate("/demo"); onClose(); }}
          className="block px-4 text-left text-gray-600 hover:text-[#7E69AB] w-full"
        >
          Démo
        </button>
        <button 
          onClick={() => { navigate("/urgence"); onClose(); }}
          className="block px-4 text-left text-gray-600 hover:text-[#7E69AB] w-full"
        >
          Numéros d'urgence
        </button>
        <button 
          onClick={() => { navigate("/about"); onClose(); }}
          className="block px-4 text-left text-gray-600 hover:text-[#7E69AB] w-full"
        >
          À propos
        </button>
        {user && (
          <button 
            onClick={() => { navigate("/mes-cartes"); onClose(); }}
            className="block px-4 text-left text-gray-600 hover:text-[#7E69AB] w-full"
          >
            Mes cartes
          </button>
        )}
        {user && (
          <button
            onClick={() => { navigate("/notifications"); onClose(); }}
            className="block px-4 text-left text-gray-600 hover:text-[#7E69AB] w-full"
          >
            Notifications
          </button>
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
                Mon profil
              </Button>
              <Button 
                variant="outline" 
                onClick={() => { onSignOut(); onClose(); }}
                className="w-full text-red-600 border-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => { navigate("/login"); onClose(); }}
                className="w-full"
              >
                Se connecter
              </Button>
              <Button 
                onClick={() => { onGetStarted(); onClose(); }}
                className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white"
              >
                Commencer
              </Button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};
