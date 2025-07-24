import { Link, useLocation } from "react-router-dom";
import { Home, Heart, MessageCircle, Bell, User } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";

export const MobileBottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { unreadCount } = useNotifications();

  const navItems = [
    { 
      name: "Home", 
      icon: Home, 
      path: "/", 
      label: "Accueil" 
    },
    { 
      name: "Favoris", 
      icon: Heart, 
      path: "/mes-favoris", 
      label: "Favoris" 
    },
    { 
      name: "Messages", 
      icon: MessageCircle, 
      path: "/messages", 
      label: "Messages" 
    },
    { 
      name: "Notifications", 
      icon: Bell, 
      path: "/notifications", 
      label: "Notifications" 
    },
    { 
      name: "Profil", 
      icon: User, 
      path: "/profile", 
      label: "Profil" 
    }
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex flex-col items-center justify-center relative group"
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-t-xl"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className={`flex flex-col items-center justify-center space-y-1 relative z-10 transition-all duration-300 ${
                  active 
                    ? "text-primary scale-110" 
                    : "text-gray-500 group-hover:text-primary group-hover:scale-105"
                }`}>
                  <div className={`relative ${active ? "drop-shadow-md" : ""}`}>
                    <IconComponent 
                      className={`h-5 w-5 transition-all duration-300 ${
                        active ? "fill-primary/20" : ""
                      }`} 
                    />
                    {active && (
                      <motion.div
                        className="absolute inset-0 bg-primary/20 rounded-full blur-sm -z-10"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    {/* Badge de notification pour les notifications */}
                    {item.name === "Notifications" && unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold animate-pulse"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </div>
                  <span className={`text-xs font-medium transition-all duration-300 ${
                    active ? "font-semibold" : ""
                  }`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};