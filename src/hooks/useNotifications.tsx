import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  reported_card_id?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUserId(null);
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      setUserId(user.id);

      // Check if user is admin
      const { data: adminStatus } = await supabase.rpc('is_admin');
      setIsAdmin(adminStatus || false);

      let query = supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      // If admin, get notifications for important system events
      if (adminStatus) {
        // Admins see their own notifications + system-wide important notifications
        query = query.or(`user_id.eq.${user.id},type.in.("system_alert","promo_payment_received","recovery_confirmed","card_found")`);
      } else {
        // Regular users see only their own notifications
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);

      // Update notifications based on admin status
      if (isAdmin) {
        query = query.or(`user_id.eq.${user.id},type.in.("system_alert","promo_payment_received","recovery_confirmed","card_found")`);
      } else {
        query = query.eq("user_id", user.id);
      }

      const { error } = await query;
      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from("notifications")
        .delete();

      // Delete notifications based on admin status
      if (isAdmin) {
        query = query.or(`user_id.eq.${user.id},type.in.("system_alert","promo_payment_received","recovery_confirmed","card_found")`);
      } else {
        query = query.eq("user_id", user.id);
      }

      const { error } = await query;
      if (error) throw error;
      
      toast({
        title: "Notifications supprimées",
        description: "Toutes vos notifications ont été supprimées avec succès."
      });
      
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer les notifications."
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Realtime subscriptions for notifications
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("user-notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: isAdmin 
            ? undefined // Admins listen to all notifications
            : `user_id=eq.${userId}` // Users listen only to their notifications
        },
        (payload) => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, isAdmin]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteAllNotifications,
    refetch: fetchNotifications,
  };
};
