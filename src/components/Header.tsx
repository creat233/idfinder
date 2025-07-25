
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { HeaderLinks } from "./HeaderLinks";
import { PublicAdsDisplay } from "./ads/PublicAdsDisplay";
import { AppMobileNav } from "./AppMobileNav";
import { useAuthState } from "@/hooks/useAuthState";
import { robustSignOut } from "@/utils/authCleanup";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, isAuthenticated } = useAuthState();
  const navigate = useNavigate();
  const { toast } = useToast();

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
          
          // Si c'est un admin et qu'on vient de se connecter, le rediriger
          if (data && user) {
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith("/admin") && 
                currentPath !== "/profile" && 
                currentPath !== "/notifications") {
              console.log('Admin détecté dans Header, redirection vers admin');
              navigate("/admin/codes-promo");
            }
          }
        }
      } catch (error) {
        console.error("Error in checkIsAdmin:", error);
        setIsAdmin(false);
      }
    };

    // Utiliser setTimeout pour éviter les deadlocks avec onAuthStateChange
    if (user) {
      setTimeout(() => {
        checkIsAdmin();
      }, 0);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <PublicAdsDisplay />
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/4f1d2be2-319b-4f55-8aa0-54813e8045c5.png" 
              alt="FinderID Logo" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-primary">FinderID</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <HeaderLinks user={user} isAdmin={isAdmin} onSignOut={handleSignOut} />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AppMobileNav
        user={user}
        isAdmin={isAdmin}
        isMenuOpen={isMenuOpen}
        onSignOut={handleSignOut}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
};

export default Header;
