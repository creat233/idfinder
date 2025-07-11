
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationCleanup } from "@/hooks/useNotificationCleanup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, Eye, CheckCircle, AlertCircle, Gift, Shield, User, CreditCard, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

export const NotificationsList = () => {
  const { notifications, loading, markAsRead, markAllAsRead, refetch } = useNotifications();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Utiliser le nettoyage automatique
  useNotificationCleanup();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'card_found':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'card_added':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'recovery_update':
        return <CheckCircle className="h-5 w-5 text-orange-500" />;
      case 'promo_code_used':
      case 'promo_payment_received':
        return <Gift className="h-5 w-5 text-purple-500" />;
      case 'security_alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'welcome':
        return <User className="h-5 w-5 text-indigo-500" />;
      case 'mcard_subscription_activated':
        return <CreditCard className="h-5 w-5 text-green-600" />;
      case 'new_message':
        return <MessageCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'card_found':
        return 'Carte trouvée';
      case 'card_added':
        return 'Carte ajoutée';
      case 'recovery_update':
        return 'Récupération';
      case 'promo_code_used':
        return 'Code promo utilisé';
      case 'promo_payment_received':
        return 'Paiement reçu';
      case 'security_alert':
        return 'Alerte de sécurité';
      case 'welcome':
        return 'Bienvenue';
      case 'mcard_subscription_activated':
        return 'mCard activée';
      case 'new_message':
        return 'Nouveau message';
      default:
        return 'Notification';
    }
  };

  const handleNotificationClick = async (notification: any) => {
    // Marquer comme lu si pas encore lu
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Rediriger selon le type de notification
    if (notification.type === 'new_message') {
      navigate('/messages');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      setDeletingIds(prev => new Set(prev).add(notificationId));
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        throw error;
      }

      toast({
        title: "Notification supprimée",
        description: "La notification a été supprimée avec succès."
      });

      // Actualiser la liste
      await refetch();
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de supprimer la notification"
      });
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      setIsDeletingAll(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Toutes les notifications supprimées",
        description: "Toutes vos notifications ont été supprimées avec succès."
      });

      // Actualiser la liste
      await refetch();
    } catch (error: any) {
      console.error('Error deleting all notifications:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de supprimer toutes les notifications"
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune notification
          </h3>
          <p className="text-gray-500">
            Vous n'avez aucune notification pour le moment.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Les notifications sont automatiquement supprimées après 24 heures.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {notifications.length} notification{notifications.length > 1 ? 's' : ''}
          <span className="text-xs text-gray-400 ml-2">
            (Suppression automatique après 24h)
          </span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
          >
            <Eye className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                disabled={isDeletingAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeletingAll ? 'Suppression...' : 'Supprimer tout'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer toutes les notifications ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer toutes vos notifications ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAllNotifications}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer tout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {notifications.map((notification) => (
        <Card 
          key={notification.id} 
          className={`transition-all cursor-pointer hover:shadow-md ${!notification.is_read ? 'border-blue-200 bg-blue-50/50' : ''} ${notification.type === 'new_message' ? 'hover:bg-blue-50' : 'hover:bg-gray-50'}`}
          onClick={() => handleNotificationClick(notification)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(notification.type)}
                  </Badge>
                  {!notification.is_read && (
                    <Badge variant="secondary" className="text-xs">
                      Nouveau
                    </Badge>
                  )}
                </div>
                
                <h4 className="font-medium text-gray-900 mb-1">
                  {notification.title}
                </h4>
                
                <p className="text-sm text-gray-600 mb-2">
                  {notification.message}
                </p>
                
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                    locale: fr
                  })}
                </p>
              </div>
              
              <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                {!notification.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={deletingIds.has(notification.id)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer cette notification ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
