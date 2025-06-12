
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { TikTok } from "./icons/TikTok";
import { ExternalLink } from "@/components/ui/external-link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/bc867b36-0b80-4eaf-b5de-c4299829a42e.png" 
                alt="FinderID Logo" 
                className="w-10 h-10"
              />
              <h3 className="text-2xl font-bold">FinderID</h3>
            </div>
            <p className="text-primary-foreground/80 mb-6">
              La solution sécurisée pour retrouver les pièces d'identité perdues au Sénégal
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61573756376174" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-secondary transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a 
                href="https://www.instagram.com/finderid.info?igsh=MXdrNjk4bjQwY3NudA%3D%3D&utm_source=qr" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-secondary transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a 
                href="https://www.tiktok.com/@finderid.info?_t=ZM-8w964za6L5z&_r=1" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-secondary transition-colors"
              >
                <TikTok className="w-5 h-5" />
                <span className="sr-only">TikTok</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-5">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-secondary transition-colors inline-block">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-secondary transition-colors inline-block">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-primary-foreground/80 hover:text-secondary transition-colors inline-block">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/numeros-urgence" className="text-primary-foreground/80 hover:text-secondary transition-colors inline-block">
                  Numéros d'urgence
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-5">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/signaler" className="text-primary-foreground/80 hover:text-secondary transition-colors inline-block">
                  Signaler une carte
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-primary-foreground/80 hover:text-secondary transition-colors inline-block">
                  Mon profil
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-secondary" />
                <span className="text-primary-foreground/80">mcard1100@gmail.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-secondary" />
                <span className="text-primary-foreground/80">+221710117579</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
          <p>&copy; {currentYear} FinderID. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
