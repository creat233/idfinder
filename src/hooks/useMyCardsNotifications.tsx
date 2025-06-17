
import { useEffect, useRef, useState } from "react";

interface UseMyCardsNotificationsProps {
  unreadCount: number;
  onSetActiveTab: (tab: "cards" | "notifications") => void;
}

export const useMyCardsNotifications = ({ 
  unreadCount, 
  onSetActiveTab 
}: UseMyCardsNotificationsProps) => {
  const prevUnreadCount = useRef(unreadCount);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!isFirstLoad.current && unreadCount > prevUnreadCount.current) {
      onSetActiveTab("notifications");
    }
    prevUnreadCount.current = unreadCount;
    isFirstLoad.current = false;
  }, [unreadCount, onSetActiveTab]);
};
