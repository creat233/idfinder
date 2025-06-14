
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useState } from "react";
import { NotificationsNavIcon } from "./NotificationsNavIcon";

type HeaderLinksProps = {
  user: any;
  isAdmin: boolean;
  onSignOut: () => void;
  onMenuClose?: () => void;
  isMobile?: boolean;
};

export const HeaderLinks = ({
  user,
  isAdmin,
  onSignOut,
  onMenuClose,
  isMobile = false,
}: HeaderLinksProps) => {
  // Gestion pour fermer le menu mobile après clic
  const handleClick = (cb?: () => void) => {
    if (onMenuClose) onMenuClose();
    if (cb) cb();
  };

  if (user) {
    if (isAdmin) {
      // ADMIN NAV
      return (
        <>
          <Link
            to="/admin/codes-promo"
            className={`text-gray-700 hover:text-orange-600${isMobile ? " block py-2" : ""}`}
            onClick={() => handleClick()}
          >
            Administration
          </Link>
          <Link
            to="/profile"
            className={`text-gray-700 hover:text-primary${isMobile ? " block py-2" : ""}`}
            onClick={() => handleClick()}
          >
            <User className="h-5 w-5" />
            {isMobile && <span className="ml-2">Profil</span>}
          </Link>
          <NotificationsNavIcon isMobile={isMobile} onClick={() => handleClick()} />
          <Button
            variant="ghost"
            onClick={() => handleClick(onSignOut)}
            className={`text-gray-700 hover:text-primary${isMobile ? " w-full justify-start block py-2 p-0" : ""}`}
          >
            <LogOut className="h-5 w-5" /> {isMobile && <span className="ml-2">Déconnexion</span>}
          </Button>
        </>
      );
    } else {
      // USER NAV
      return (
        <>
          <Link
            to="/signaler"
            className={`text-gray-700 hover:text-primary${isMobile ? " block py-2" : ""}`}
            onClick={() => handleClick()}
          >
            Signaler une carte
          </Link>
          <Link
            to="/mes-cartes"
            className={`text-gray-700 hover:text-primary${isMobile ? " block py-2" : ""}`}
            onClick={() => handleClick()}
          >
            Mes cartes
          </Link>
          <Link
            to="/codes-promo"
            className={`text-gray-700 hover:text-primary${isMobile ? " block py-2" : ""}`}
            onClick={() => handleClick()}
          >
            Codes promo
          </Link>
          <NotificationsNavIcon isMobile={isMobile} onClick={() => handleClick()} />
          <Link
            to="/profile"
            className={`text-gray-700 hover:text-primary${isMobile ? " block py-2" : ""}`}
            onClick={() => handleClick()}
          >
            <User className="h-5 w-5" />
            {isMobile && <span className="ml-2">Profil</span>}
          </Link>
          <Button
            variant="ghost"
            onClick={() => handleClick(onSignOut)}
            className={`text-gray-700 hover:text-primary${isMobile ? " w-full justify-start block py-2 p-0" : ""}`}
          >
            <LogOut className="h-5 w-5" /> {isMobile && <span className="ml-2">Déconnexion</span>}
          </Button>
        </>
      );
    }
  } else {
    // NON CONNECTED NAV
    return (
      <>
        <Link
          to="/urgence"
          className={`text-gray-700 hover:text-primary${isMobile ? " block py-2" : ""}`}
          onClick={() => handleClick()}
        >
          Numéros d'urgence
        </Link>
        <Link
          to="/support"
          className={`text-gray-700 hover:text-primary${isMobile ? " block py-2" : ""}`}
          onClick={() => handleClick()}
        >
          Support
        </Link>
        <Link to="/auth" onClick={() => handleClick()}>
          <Button>Se connecter</Button>
        </Link>
      </>
    );
  }
};
