
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";

type Props = {
  user: SupabaseUser | null;
  onSignOut: () => void;
  onGetStarted: () => void;
};

export const PublicHeaderDesktopNav = ({ user, onSignOut, onGetStarted }: Props) => {
  const navigate = useNavigate();

  return (
    <>
      <nav className="hidden md:flex items-center space-x-8">
        <a href="/#fonctionnalites" className="text-gray-600 hover:text-[#7E69AB] transition-colors">
          Fonctionnalités
        </a>
        <a href="/#tarifs" className="text-gray-600 hover:text-[#7E69AB] transition-colors">
          Tarifs
        </a>
        <button 
          onClick={() => navigate("/demo")}
          className="text-gray-600 hover:text-[#7E69AB] transition-colors"
        >
          Démo
        </button>
        <button 
          onClick={() => navigate("/urgence")}
          className="text-gray-600 hover:text-[#7E69AB] transition-colors"
        >
          Numéros d'urgence
        </button>
        <button 
          onClick={() => navigate("/about")}
          className="text-gray-600 hover:text-[#7E69AB] transition-colors"
        >
          À propos
        </button>
        {user && (
          <button 
            onClick={() => navigate("/mes-cartes")}
            className="text-gray-600 hover:text-[#7E69AB] transition-colors"
          >
            Mes cartes
          </button>
        )}
        {user && (
          <button
            onClick={() => navigate("/notifications")}
            className="text-gray-600 hover:text-[#7E69AB] transition-colors"
          >
            Notifications
          </button>
        )}
      </nav>
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/profile")}
              className="text-gray-600 hover:text-[#7E69AB]"
            >
              <User className="mr-2 h-4 w-4" />
              Mon profil
            </Button>
            <Button 
              variant="ghost" 
              onClick={onSignOut}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")}
              className="text-gray-600 hover:text-[#7E69AB]"
            >
              Se connecter
            </Button>
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white hover:opacity-90"
            >
              Commencer
            </Button>
          </>
        )}
      </div>
    </>
  );
};
