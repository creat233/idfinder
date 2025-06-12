
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

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
            <div className="w-8 h-8 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FinderID</span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#fonctionnalites" className="text-gray-600 hover:text-[#7E69AB] transition-colors">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="text-gray-600 hover:text-[#7E69AB] transition-colors">
              Tarifs
            </a>
            <a href="/demo" className="text-gray-600 hover:text-[#7E69AB] transition-colors">
              Démo
            </a>
            <a href="/numeros-urgence" className="text-gray-600 hover:text-[#7E69AB] transition-colors">
              Numéros d'urgence
            </a>
            {user && (
              <button 
                onClick={() => navigate("/mes-cartes")}
                className="text-gray-600 hover:text-[#7E69AB] transition-colors"
              >
                Mes cartes
              </button>
            )}
          </nav>

          {/* Boutons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/profile")}
                  className="text-gray-600 hover:text-[#7E69AB]"
                >
                  <User className="mr-2 h-4 w-4" />
                  Mon profil
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/login")}
                  className="text-gray-600 hover:text-[#7E69AB]"
                >
                  Se connecter
                </Button>
                <Button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white hover:opacity-90"
                >
                  Commencer
                </Button>
              </>
            )}
          </div>

          {/* Menu Mobile */}
          <button
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu Mobile Ouvert */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="py-4 space-y-4">
              <a href="#fonctionnalites" className="block px-4 text-gray-600 hover:text-[#7E69AB]">
                Fonctionnalités
              </a>
              <a href="#tarifs" className="block px-4 text-gray-600 hover:text-[#7E69AB]">
                Tarifs
              </a>
              <a href="/demo" className="block px-4 text-gray-600 hover:text-[#7E69AB]">
                Démo
              </a>
              <a href="/numeros-urgence" className="block px-4 text-gray-600 hover:text-[#7E69AB]">
                Numéros d'urgence
              </a>
              {user && (
                <button 
                  onClick={() => navigate("/mes-cartes")}
                  className="block px-4 text-left text-gray-600 hover:text-[#7E69AB] w-full"
                >
                  Mes cartes
                </button>
              )}
              <div className="px-4 pt-4 space-y-2">
                {user ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/profile")}
                      className="w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Mon profil
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleSignOut}
                      className="w-full text-red-600 border-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/login")}
                      className="w-full"
                    >
                      Se connecter
                    </Button>
                    <Button 
                      onClick={handleGetStarted}
                      className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white"
                    >
                      Commencer
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
