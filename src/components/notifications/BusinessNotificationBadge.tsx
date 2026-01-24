import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Bell, 
  BellRing, 
  MessageCircle, 
  Calendar, 
  DollarSign, 
  CheckCircle,
  User,
  X,
  Settings,
  BellOff
} from 'lucide-react';
import { useBusinessNotifications } from '@/hooks/useBusinessNotifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface BusinessNotificationBadgeProps {
  mcardId?: string;
}

export const BusinessNotificationBadge = ({ mcardId }: BusinessNotificationBadgeProps) => {
  const {
    notifications,
    unreadCount,
    isEnabled,
    markAsRead,
    clearAll,
    toggleNotifications,
    requestNotificationPermission
  } = useBusinessNotifications(mcardId);
  
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_message':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'new_appointment':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'new_sale':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'payment_received':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'new_client':
        return <User className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'new_message':
        return 'bg-blue-50 border-blue-200';
      case 'new_appointment':
        return 'bg-purple-50 border-purple-200';
      case 'new_sale':
        return 'bg-green-50 border-green-200';
      case 'payment_received':
        return 'bg-emerald-50 border-emerald-200';
      case 'new_client':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      toggleNotifications();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <AnimatePresence mode="wait">
            {unreadCount > 0 ? (
              <motion.div
                key="bell-ring"
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <BellRing className="h-5 w-5 text-primary" />
              </motion.div>
            ) : (
              <Bell className="h-5 w-5" />
            )}
          </AnimatePresence>
          
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge 
                variant="destructive" 
                className="h-5 w-5 p-0 flex items-center justify-center text-xs font-bold animate-pulse"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BellRing className="h-4 w-4 text-primary" />
              Notifications temps réel
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleNotifications}
                title={isEnabled ? 'Désactiver les notifications' : 'Activer les notifications'}
              >
                {isEnabled ? (
                  <Bell className="h-4 w-4 text-green-500" />
                ) : (
                  <BellOff className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={clearAll}
                  title="Tout effacer"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-2">
            {!isEnabled ? (
              <div className="text-center py-6">
                <BellOff className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  Les notifications sont désactivées
                </p>
                <Button size="sm" onClick={handleEnableNotifications}>
                  <Bell className="h-4 w-4 mr-2" />
                  Activer
                </Button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-6">
                <Bell className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Aucune notification récente
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Vous serez notifié des nouveaux messages, RDV et ventes
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <AnimatePresence>
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 mb-2 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        getNotificationBgColor(notification.type)
                      } ${!notification.isRead ? 'ring-2 ring-primary/20' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold truncate">
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(notification.timestamp, { 
                              addSuffix: true, 
                              locale: fr 
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
