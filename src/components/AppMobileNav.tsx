
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

type Props = {
  user: any;
  isAdmin: boolean;
  isMenuOpen: boolean;
  onSignOut: () => void;
  onClose: () => void;
};

export const AppMobileNav = ({ user, isAdmin, isMenuOpen, onSignOut, onClose }: Props) => {
  const navigate = useNavigate();

  if (!isMenuOpen) return null;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const renderLink = (to: string, text: string) => (
    <Link to={to} className="block px-4 text-gray-700 hover:text-primary" onClick={onClose}>
      {text}
    </Link>
  );
  
  const loggedInNav = (
    <>
      {isAdmin ? (
        renderLink("/admin/codes-promo", "Administration")
      ) : (
        <>
          {renderLink("/signaler", "Signaler une carte")}
          {renderLink("/mes-cartes", "Mes cartes")}
          {renderLink("/codes-promo", "Codes promo")}
          {renderLink("/messages", "Messages")}
        </>
      )}
      {renderLink("/notifications", "Notifications")}
    </>
  );

  const loggedOutNav = (
    <>
      {renderLink("/urgence", "Numéros d'urgence")}
      {renderLink("/support", "Support")}
    </>
  );

  const authButtons = (
    <div className="px-4 pt-4 space-y-2 border-t border-gray-200">
      {user ? (
        <>
          <Button 
            variant="outline" 
            onClick={() => handleNavigate("/profile")}
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
        <Button 
          variant="outline" 
          onClick={() => handleNavigate("/auth")}
          className="w-full"
        >
          Se connecter
        </Button>
      )}
    </div>
  );

  return (
    <div className="md:hidden bg-white border-t border-gray-200">
      <nav className="py-4 space-y-4">
        {user ? loggedInNav : loggedOutNav}
        {authButtons}
      </nav>
    </div>
  );
};
