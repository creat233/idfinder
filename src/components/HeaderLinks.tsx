
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { NotificationsNavIcon } from "./NotificationsNavIcon";

type HeaderLinksProps = {
  user: any;
  isAdmin: boolean;
  onSignOut: () => void;
};

export const HeaderLinks = ({
  user,
  isAdmin,
  onSignOut,
}: HeaderLinksProps) => {

  if (user) {
    if (isAdmin) {
      // ADMIN NAV
      return (
        <>
          <Link
            to="/admin/codes-promo"
            className="text-gray-700 hover:text-orange-600"
          >
            Administration
          </Link>
          <Link
            to="/profile"
            className="text-gray-700 hover:text-primary"
          >
            <User className="h-5 w-5" />
          </Link>
          <NotificationsNavIcon />
          <Button
            variant="ghost"
            onClick={onSignOut}
            className="text-gray-700 hover:text-primary"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </>
      );
    } else {
      // USER NAV
      return (
        <>
          <Link
            to="/signaler"
            className="text-gray-700 hover:text-primary"
          >
            Signaler une carte
          </Link>
          <Link
            to="/mes-cartes"
            className="text-gray-700 hover:text-primary"
          >
            Mes cartes
          </Link>
          <Link
            to="/codes-promo"
            className="text-gray-700 hover:text-primary"
          >
            Codes promo
          </Link>
          <NotificationsNavIcon />
          <Link
            to="/profile"
            className="text-gray-700 hover:text-primary"
          >
            <User className="h-5 w-5" />
          </Link>
          <Button
            variant="ghost"
            onClick={onSignOut}
            className="text-gray-700 hover:text-primary"
          >
            <LogOut className="h-5 w-5" />
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
          className="text-gray-700 hover:text-primary"
        >
          Numéros d'urgence
        </Link>
        <Link
          to="/support"
          className="text-gray-700 hover:text-primary"
        >
          Support
        </Link>
        <Link to="/auth">
          <Button>Se connecter</Button>
        </Link>
      </>
    );
  }
};
