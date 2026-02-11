
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { NotificationsNavIcon } from "./NotificationsNavIcon";
import { cn } from "@/lib/utils";

type HeaderLinksProps = {
  user: any;
  isAdmin: boolean;
  onSignOut: () => void;
};

const NavLink = ({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) => (
  <Link
    to={to}
    className={cn(
      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
      active 
        ? "bg-primary/10 text-primary" 
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    )}
  >
    {children}
  </Link>
);

export const HeaderLinks = ({ user, isAdmin, onSignOut }: HeaderLinksProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  if (user) {
    if (isAdmin) {
      return (
        <>
          <NavLink to="/admin" active={isActive("/admin")}>Administration</NavLink>
          <div className="w-px h-5 bg-border mx-1" />
          <NotificationsNavIcon />
          <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
            <User className="h-5 w-5" />
          </Link>
          <Button variant="ghost" size="icon" onClick={onSignOut} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </>
      );
    }

    return (
      <>
        <NavLink to="/signaler" active={isActive("/signaler")}>Signaler</NavLink>
        <NavLink to="/mes-cartes" active={isActive("/mes-cartes")}>Mes cartes</NavLink>
        <NavLink to="/codes-promo" active={isActive("/codes-promo")}>Promos</NavLink>
        <NavLink to="/messages" active={isActive("/messages")}>Messages</NavLink>
        <NavLink to="/mcards" active={isActive("/mcards")}>mCards</NavLink>
        <div className="w-px h-5 bg-border mx-1" />
        <NotificationsNavIcon />
        <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
          <User className="h-5 w-5" />
        </Link>
        <Button variant="ghost" size="icon" onClick={onSignOut} className="text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4" />
        </Button>
      </>
    );
  }

  return (
    <>
      <NavLink to="/urgence" active={isActive("/urgence")}>Urgence</NavLink>
      <NavLink to="/support" active={isActive("/support")}>Support</NavLink>
      <div className="w-px h-5 bg-border mx-1" />
      <Link to="/auth">
        <Button size="sm" className="font-medium">Se connecter</Button>
      </Link>
    </>
  );
};
