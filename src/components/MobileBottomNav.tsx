import { Link, useLocation } from "react-router-dom";
import { Home, CheckCircle, MessageCircle, Bell, User } from "lucide-react";
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
      name: "Produits", 
      icon: CheckCircle, 
      path: "/mcards-non-verifiees", 
      label: "Produits" 
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
      {/* Ombre douce au-dessus de la barre */}
      <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      
      <div className="relative bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
        {/* Ligne décorative en haut */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="grid grid-cols-4 h-20 py-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex flex-col items-center justify-center relative group overflow-hidden"
              >
                {/* Indicateur actif avec animation */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 rounded-2xl mx-1 my-1"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
                  />
                )}
                
                {/* Animation de hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-gray-100/0 to-gray-100/50 rounded-2xl mx-1 my-1 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.2 }}
                />
                
                <div className={`flex flex-col items-center justify-center space-y-1 relative z-10 transition-all duration-300 ${
                  active 
                    ? "text-primary transform scale-110" 
                    : "text-gray-500 group-hover:text-primary group-hover:scale-105"
                }`}>
                  <div className={`relative ${active ? "drop-shadow-lg" : ""}`}>
                    {/* Effet de lueur pour l'icône active */}
                    {active && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/40 via-blue-500/40 to-purple-500/40 rounded-full blur-lg scale-150"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.6, scale: 1.5 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    )}
                    
                    <motion.div
                      animate={active ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <IconComponent 
                        className={`h-6 w-6 transition-all duration-300 relative z-10 ${
                          active 
                            ? "text-primary drop-shadow-md stroke-[2.5]" 
                            : "group-hover:text-primary/80"
                        }`} 
                      />
                    </motion.div>
                    
                    {/* Badge de notification pour les notifications */}
                    {item.name === "Notifications" && unreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge 
                          variant="destructive" 
                          className="h-6 w-6 flex items-center justify-center p-0 text-xs font-bold animate-bounce shadow-lg ring-2 ring-white"
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      </motion.div>
                    )}
                    
                    {/* Badge de notification pour les messages */}
                    {item.name === "Messages" && unreadMessages > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge 
                          variant="destructive" 
                          className="h-6 w-6 flex items-center justify-center p-0 text-xs font-bold animate-bounce shadow-lg ring-2 ring-white"
                        >
                          {unreadMessages > 99 ? '99+' : unreadMessages}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.span 
                    className={`text-[10px] font-medium transition-all duration-300 leading-tight ${
                      active ? "font-bold text-primary" : "text-gray-500"
                    }`}
                    animate={active ? { y: -1 } : { y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {item.label}
                  </motion.span>
                </div>
                
                {/* Effet de ripple au clic */}
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-2xl mx-1 my-1 scale-0"
                  whileTap={{ scale: 1.2, opacity: [0, 0.3, 0] }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};