import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { PublicHeaderDesktopNav } from "./PublicHeaderDesktopNav";
import { PublicHeaderMobileNav } from "./PublicHeaderMobileNav";

export const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current user session
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/signaler");
    } else {
      navigate("/login");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    });
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src="/lovable-uploads/4f1d2be2-319b-4f55-8aa0-54813e8045c5.png" 
              alt="FinderID Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-900">FinderID</span>
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
