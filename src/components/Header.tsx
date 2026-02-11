
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { HeaderLinks } from "./HeaderLinks";
import { PublicAdsDisplay } from "./ads/PublicAdsDisplay";
import { AppMobileNav } from "./AppMobileNav";
import { useAuthState } from "@/hooks/useAuthState";
import { robustSignOut } from "@/utils/authCleanup";
import { useUserPresence } from "@/hooks/useUserPresence";
import { NotificationsNavIcon } from "./NotificationsNavIcon";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, isAuthenticated } = useAuthState();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useUserPresence(user?.id);

  useEffect(() => {
    const checkIsAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      try {
        const { data, error } = await supabase.rpc('is_admin');
        if (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data || false);
          if (data && user) {
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith("/admin") && 
                currentPath !== "/profile" && 
                currentPath !== "/notifications") {
              navigate("/admin/codes-promo");
            }
          }
        }
      } catch (error) {
        console.error("Error in checkIsAdmin:", error);
        setIsAdmin(false);
      }
    };

    if (user) {
      setTimeout(() => { checkIsAdmin(); }, 0);
    } else {
      setIsAdmin(false);
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await robustSignOut(supabase);
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: "Une erreur s'est produite lors de la déconnexion.",
      });
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <PublicAdsDisplay />
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src="/lovable-uploads/4f1d2be2-319b-4f55-8aa0-54813e8045c5.png" 
            alt="FinderID Logo" 
            className="h-9 w-9 transition-transform group-hover:scale-105"
          />
          <span className="text-xl font-bold text-primary tracking-tight">FinderID</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <HeaderLinks user={user} isAdmin={isAdmin} onSignOut={handleSignOut} />
        </div>

        {/* Mobile: notifications + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && <NotificationsNavIcon />}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
              <AppMobileNav
                user={user}
                isAdmin={isAdmin}
                isMenuOpen={true}
                onSignOut={handleSignOut}
                onClose={() => setIsMenuOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;
