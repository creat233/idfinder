
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    }
  };

  return (
    <header className="w-full bg-primary py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-primary-foreground text-2xl font-bold">
          FinderID
        </Link>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          className="md:hidden text-primary-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-primary-foreground hover:text-secondary transition-colors">
            À propos
          </Link>
          <Link to="/support" className="text-primary-foreground hover:text-secondary transition-colors">
            Support
          </Link>
          <Link to="/profile" className="text-primary-foreground hover:text-secondary transition-colors">
            Mon Profil
          </Link>
          <Link to="/signaler">
            <Button variant="secondary">Signaler une carte</Button>
          </Link>
          <Button 
            variant="ghost" 
            className="text-primary-foreground hover:text-secondary"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-primary p-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/about" 
                className="text-primary-foreground hover:text-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link 
                to="/support" 
                className="text-primary-foreground hover:text-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <Link 
                to="/profile" 
                className="text-primary-foreground hover:text-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Mon Profil
              </Link>
              <Link 
                to="/signaler" 
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="secondary" className="w-full">
                  Signaler une carte
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-primary-foreground hover:text-secondary w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
