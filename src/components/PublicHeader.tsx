
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { PublicHeaderDesktopNav } from "./PublicHeaderDesktopNav";
import { PublicHeaderMobileNav } from "./PublicHeaderMobileNav";
import { PublicAdsDisplay } from "./ads/PublicAdsDisplay";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthState } from "@/hooks/useAuthState";
import { robustSignOut } from "@/utils/authCleanup";

export const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthState();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleGetStarted = () => {
    if (user) {
      navigate("/signaler");
    } else {
      navigate("/login");
    }
  };

  const handleSignOut = async () => {
    try {
      await robustSignOut(supabase);
      toast({
        title: t("signOutSuccessTitle"),
        description: t("signOutSuccessDesc"),
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
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <PublicAdsDisplay />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src="/lovable-uploads/4f1d2be2-319b-4f55-8aa0-54813e8045c5.png" 
              alt="FinderID Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-900">{t("appName")}</span>
          </div>

          {/* Navigation Desktop et Boutons */}
          <PublicHeaderDesktopNav 
            user={user}
            onSignOut={handleSignOut}
            onGetStarted={handleGetStarted}
          />

          {/* Menu Mobile */}
          <button
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu Mobile Ouvert */}
        <PublicHeaderMobileNav
          user={user}
          isMenuOpen={isMenuOpen}
          onSignOut={handleSignOut}
          onGetStarted={handleGetStarted}
          onClose={() => setIsMenuOpen(false)}
        />
      </div>
    </header>
  );
};
