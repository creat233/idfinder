import { Link, useLocation } from "react-router-dom";
import { Home, Heart, MessageCircle, Bell, User } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const MobileBottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { unreadCount } = useNotifications();
  const [user, setUser] = useState<any>(null);
  const { unreadCount: unreadMessages } = useUnreadMessages(user);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const navItems = [
    { 
      name: "Home", 
      icon: Home, 
      path: "/", 
      label: "Accueil" 
    },
    { 
      name: "MCards", 
      icon: Heart, 
      path: "/verified-mcards", 
      label: "MCards" 
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
      <div className="bg-gradient-to-r from-white/95 via-blue-50/95 to-purple-50/95 backdrop-blur-md border-t border-gradient-primary/20 shadow-xl">
        <div className="grid grid-cols-5 h-18 py-2">
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
                    className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent rounded-t-xl shadow-lg"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className={`flex flex-col items-center justify-center space-y-1 relative z-10 transition-all duration-300 ${
                  active 
                    ? "text-primary scale-110 font-bold" 
                    : "text-gray-600 group-hover:text-primary group-hover:scale-105"
                }`}>
                  <div className={`relative ${active ? "drop-shadow-lg" : ""}`}>
                    <IconComponent 
                      className={`h-6 w-6 transition-all duration-300 ${
                        active ? "fill-primary/30 stroke-2" : ""
                      }`} 
                    />
                    {active && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-full blur-md -z-10"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.4, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.4 }}
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
                    {/* Badge de notification pour les messages */}
                    {item.name === "Messages" && unreadMessages > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold animate-pulse"
                      >
                        {unreadMessages > 99 ? '99+' : unreadMessages}
                      </Badge>
                    )}
                  </div>
                  <span className={`text-xs font-medium transition-all duration-300 ${
                    active ? "font-bold text-primary" : ""
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