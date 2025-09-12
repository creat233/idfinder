
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

  const renderLink = (to: string, text: string, requiresAuth = false) => (
    <Link 
      to={to} 
      className="block px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg mx-2 transition-colors" 
      onClick={(e) => {
        if (requiresAuth && !user) {
          e.preventDefault();
          navigate("/auth");
          onClose();
          return;
        }
        onClose();
      }}
    >
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
          {renderLink("/mcards-verifiees", "MCards Vérifiées")}
          {renderLink("/codes-promo", "Codes promo")}
          {renderLink("/messages", "Messages")}
          {renderLink("/mes-favoris", "Mes favoris")}
          {renderLink("/panier", "Panier")}
        </>
      )}
      {renderLink("/notifications", "Notifications")}
    </>
  );

  const loggedOutNav = (
    <>
      {renderLink("/mcards-verifiees", "MCards Vérifiées")}
      {renderLink("/codes-promo", "Codes promo")}
      {renderLink("/messages", "Messages", true)}
      {renderLink("/notifications", "Notifications", true)}
      {renderLink("/mes-favoris", "Mes favoris")}
      {renderLink("/panier", "Panier")}
      {renderLink("/demo", "Démo")}
      {renderLink("/urgence", "Numéros d'urgence")}
      {renderLink("/about", "À propos")}
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
            className="w-full justify-start text-sm"
          >
            <User className="mr-2 h-4 w-4" />
            Mon profil
          </Button>
          <Button 
            variant="outline" 
            onClick={() => { onSignOut(); onClose(); }}
            className="w-full justify-start text-sm text-red-600 border-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => handleNavigate("/auth")}
          className="w-full text-sm"
        >
          Se connecter
        </Button>
      )}
    </div>
  );

  return (
    <div className="md:hidden bg-white border-t border-gray-200 max-h-[80vh] overflow-y-auto">
      <nav className="py-4 space-y-2">
        <div className="space-y-1">
          {user ? loggedInNav : loggedOutNav}
        </div>
        {authButtons}
      </nav>
    </div>
  );
};
