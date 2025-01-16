import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">IDFinder</h3>
            <p className="text-primary-foreground/80">
              La solution sécurisée pour retrouver les pièces d'identité perdues
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-secondary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-secondary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-secondary transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/signaler" className="hover:text-secondary transition-colors">
                  Signaler une carte
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-secondary transition-colors">
                  Mon profil
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-primary-foreground/80">
              Email: contact@idfinder.ch<br />
              Tél: +41 XX XXX XX XX
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} IDFinder. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};