
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, LogOut, CreditCard, Search, Tag, MessageSquare, 
  LayoutGrid, Heart, ShoppingBag, Phone, Info, HelpCircle,
  Bell, Shield, Eye
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type Props = {
  user: any;
  isAdmin: boolean;
  isMenuOpen: boolean;
  onSignOut: () => void;
  onClose: () => void;
};

export const AppMobileNav = ({ user, isAdmin, isMenuOpen, onSignOut, onClose }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isMenuOpen) return null;

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, requiresAuth = false }: { 
    to: string; icon: any; label: string; requiresAuth?: boolean 
  }) => (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
        isActive(to)
          ? "bg-primary/10 text-primary"
          : "text-foreground/80 hover:bg-muted active:scale-[0.98]"
      )}
      onClick={(e) => {
        if (requiresAuth && !user) {
          e.preventDefault();
          navigate("/auth");
        }
        onClose();
      }}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />
      <span>{label}</span>
    </Link>
  );

  const SectionLabel = ({ children }: { children: string }) => (
    <p className="px-4 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background">
      {/* User header */}
      {user && (
        <div className="p-5 pb-4 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user.email}
              </p>
              <Badge variant="outline" className="mt-1 border-green-500/50 text-green-600 bg-green-50 text-[10px] h-5">
                <span className="relative flex h-1.5 w-1.5 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
                En ligne
              </Badge>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 py-2 space-y-1">
        {user ? (
          isAdmin ? (
            <>
              <SectionLabel>Administration</SectionLabel>
              <NavItem to="/admin/codes-promo" icon={Shield} label="Panneau Admin" />
              <NavItem to="/notifications" icon={Bell} label="Notifications" />
            </>
          ) : (
            <>
              <SectionLabel>Cartes d'identité</SectionLabel>
              <NavItem to="/signaler" icon={Search} label="Signaler une carte" />
              <NavItem to="/mes-cartes" icon={CreditCard} label="Mes cartes" />

              <SectionLabel>Cartes de visite MCard</SectionLabel>
              <NavItem to="/mcards" icon={LayoutGrid} label="Abonnement mCard" />
              <NavItem to="/mcards-verifiees" icon={Eye} label="MCards vérifiées" />

              <SectionLabel>Services</SectionLabel>
              <NavItem to="/codes-promo" icon={Tag} label="Codes promo" />
              <NavItem to="/messages" icon={MessageSquare} label="Messages" />
              <NavItem to="/notifications" icon={Bell} label="Notifications" />
              <NavItem to="/mes-favoris" icon={Heart} label="Mes favoris" />
              <NavItem to="/panier" icon={ShoppingBag} label="Panier" />
            </>
          )
        ) : (
          <>
            <SectionLabel>Découvrir</SectionLabel>
            <NavItem to="/mcards-verifiees" icon={Eye} label="MCards vérifiées" />
            <NavItem to="/codes-promo" icon={Tag} label="Codes promo" />
            <NavItem to="/demo" icon={LayoutGrid} label="Démo" />

            <SectionLabel>Aide</SectionLabel>
            <NavItem to="/urgence" icon={Phone} label="Numéros d'urgence" />
            <NavItem to="/about" icon={Info} label="À propos" />
            <NavItem to="/support" icon={HelpCircle} label="Support" />

            <SectionLabel>Communication</SectionLabel>
            <NavItem to="/messages" icon={MessageSquare} label="Messages" requiresAuth />
            <NavItem to="/mes-favoris" icon={Heart} label="Mes favoris" />
            <NavItem to="/panier" icon={ShoppingBag} label="Panier" />
          </>
        )}
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-border space-y-2 mt-auto">
        {user ? (
          <>
            <Button
              variant="outline"
              onClick={() => { navigate("/profile"); onClose(); }}
              className="w-full justify-start gap-2 h-11 rounded-xl"
            >
              <User className="h-4 w-4" />
              Mon profil
            </Button>
            <Button
              variant="ghost"
              onClick={() => { onSignOut(); onClose(); }}
              className="w-full justify-start gap-2 h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </>
        ) : (
          <Button
            onClick={() => { navigate("/auth"); onClose(); }}
            className="w-full h-11 rounded-xl font-semibold"
          >
            Se connecter
          </Button>
        )}
      </div>
    </div>
  );
};
