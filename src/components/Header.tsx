
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User, Settings, Globe, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/useTranslation";
import { useNotifications } from "@/hooks/useNotifications";
import { getAvailableLanguages } from "@/utils/translations";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const { unreadCount } = useNotifications();
  const availableLanguages = getAvailableLanguages();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
  };

  const getCurrentLanguageFlag = () => {
    const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);
    return currentLang?.flag || "🇫🇷";
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/dd162e07-382f-4111-a227-a319a73cc433.png" 
              alt="FinderID Logo" 
              className="w-8 h-8"
            />
            <span className="font-bold text-xl">{t("appName")}</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-secondary transition-colors ${
                location.pathname === "/" ? "text-secondary" : ""
              }`}
            >
              {t("home")}
            </Link>
            <Link 
              to="/signaler" 
              className={`hover:text-secondary transition-colors ${
                location.pathname === "/signaler" ? "text-secondary" : ""
              }`}
            >
              {t("signalCard")}
            </Link>
            <Link 
              to="/mes-cartes" 
              className={`hover:text-secondary transition-colors flex items-center gap-1 ${
                location.pathname === "/mes-cartes" ? "text-secondary" : ""
              }`}
            >
              <CreditCard className="h-4 w-4" />
              {t("myCards") || "Mes cartes"}
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link 
              to="/support" 
              className={`hover:text-secondary transition-colors ${
                location.pathname === "/support" ? "text-secondary" : ""
              }`}
            >
              {t("support")}
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-secondary">
                  <Globe className="h-4 w-4 mr-1" />
                  <span className="text-lg">{getCurrentLanguageFlag()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-white z-50">
                {availableLanguages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`cursor-pointer ${
                      currentLanguage === language.code ? "bg-accent" : ""
                    }`}
                  >
                    <span className="mr-2">{language.flag}</span>
                    {language.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-secondary">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white z-50">
                <DropdownMenuItem onClick={() => navigate("/mes-cartes")} className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t("myCards") || "Mes cartes"}
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  {t("profile")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/support")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  {t("support")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-red-600"
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? t("loggingOut") : t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
