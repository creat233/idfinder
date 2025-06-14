
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/useToast";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Vérifier si l'utilisateur est admin
      if (user?.email === "mouhamed110000@gmail.com") {
        setIsAdmin(true);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user?.email === "mouhamed110000@gmail.com") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      showSuccess("Déconnexion réussie", "Vous avez été déconnecté avec succès");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/dd162e07-382f-4111-a227-a319a73cc433.png" 
              alt="FinderID Logo" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-primary">FinderID</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {isAdmin ? (
                  // Navigation pour l'admin
                  <>
                    <Link to="/admin/codes-promo" className="text-gray-700 hover:text-orange-600">
                      Administration
                    </Link>
                  </>
                ) : (
                  // Navigation pour les utilisateurs normaux
                  <>
                    <Link to="/signaler" className="text-gray-700 hover:text-primary">
                      Signaler une carte
                    </Link>
                    <Link to="/mes-cartes" className="text-gray-700 hover:text-primary">
                      Mes cartes
                    </Link>
                    <Link to="/codes-promo" className="text-gray-700 hover:text-primary">
                      Codes promo
                    </Link>
                  </>
                )}
                <Link to="/profile" className="text-gray-700 hover:text-primary">
                  <User className="h-5 w-5" />
                </Link>
                {/* Remplacement du lien Notifications par Link */}
                <Link to="/notifications" className="text-gray-700 hover:text-primary relative">
                  <span className="sr-only">Notifications</span>
                  <span className="flex">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#9694ff" strokeWidth="2" fill="none"/>
                      <path d="M12 17a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm5-2V9a5 5 0 0 0-10 0v6l-1.293 1.293A1 1 0 0 0 7 19h10a1 1 0 0 0 .707-1.707L17 15z" stroke="#9694ff" strokeWidth="2" fill="none"/>
                    </svg>
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-primary"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/urgence" className="text-gray-700 hover:text-primary">
                  Numéros d'urgence
                </Link>
                <Link to="/support" className="text-gray-700 hover:text-primary">
                  Support
                </Link>
                <Link to="/auth">
                  <Button>Se connecter</Button>
                </Link>
              </>
            )}
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              {user ? (
                <>
                  {isAdmin ? (
                    // Navigation mobile pour l'admin
                    <>
                      <Link 
                        to="/admin/codes-promo" 
                        className="text-gray-700 hover:text-orange-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Administration
                      </Link>
                    </>
                  ) : (
                    // Navigation mobile pour les utilisateurs normaux
                    <>
                      <Link 
                        to="/signaler" 
                        className="text-gray-700 hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Signaler une carte
                      </Link>
                      <Link 
                        to="/mes-cartes" 
                        className="text-gray-700 hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mes cartes
                      </Link>
                      <Link 
                        to="/codes-promo" 
                        className="text-gray-700 hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Codes promo
                      </Link>
                      {/* Ajout du lien mobile vers notifications */}
                      <Link 
                        to="/notifications"
                        className="text-gray-700 hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Notifications
                      </Link>
                    </>
                  )}
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-primary justify-start p-0"
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    to="/urgence" 
                    className="text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Numéros d'urgence
                  </Link>
                  <Link 
                    to="/support" 
                    className="text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Support
                  </Link>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button>Se connecter</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
