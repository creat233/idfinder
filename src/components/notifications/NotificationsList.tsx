
import { Bell, BellOff, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "@/hooks/useTranslation";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsList = ({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationsListProps) => {
  const { t } = useTranslation();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <BellOff className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            {t("noNotifications") || "Aucune notification"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t("notificationsWillAppearHere") || "Vos notifications apparaîtront ici"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="text-lg font-medium">{t("notifications") || "Notifications"}</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            {t("markAllAsRead") || "Tout marquer comme lu"}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`cursor-pointer transition-colors ${
              !notification.is_read ? "border-primary bg-primary/5" : "hover:bg-gray-50"
            }`}
            onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {notification.title}
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </CardTitle>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.created_at), { 
                    addSuffix: true,
                    locale: fr 
                  })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700">{notification.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
