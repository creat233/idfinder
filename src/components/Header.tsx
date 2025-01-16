import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="w-full bg-primary py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-primary-foreground text-2xl font-bold">
          IDFinder
        </Link>
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
        </nav>
      </div>
    </header>
  );
};