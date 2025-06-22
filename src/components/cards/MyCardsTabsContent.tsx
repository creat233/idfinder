
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserCardsList } from "./UserCardsList";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { MyCardsExplanation } from "./MyCardsExplanation";
import { NotificationDebugButton } from "./NotificationDebugButton";
import { useTranslation } from "@/hooks/useTranslation";

interface UserCard {
  id: string;
  card_number: string;
  document_type: string;
  card_holder_name?: string;
  is_active: boolean;
  created_at: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  reported_card_id?: string;
}

interface MyCardsTabsContentProps {
  activeTab: "cards" | "notifications";
  onTabChange: (tab: "cards" | "notifications") => void;
  cards: UserCard[];
  cardsLoading: boolean;
  notifications: Notification[];
  notificationsLoading: boolean;
  unreadCount: number;
  onToggleCardStatus: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteAllNotifications?: () => void;
}

export const MyCardsTabsContent = ({
  activeTab,
  onTabChange,
  cards,
  cardsLoading,
  notifications,
  notificationsLoading,
  unreadCount,
  onToggleCardStatus,
  onDeleteCard,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteAllNotifications,
}: MyCardsTabsContentProps) => {
  const { t } = useTranslation();

  // Check if user has the specific card number 1234567890
  const hasCard1234567890 = cards.some(card => card.card_number === "1234567890");

  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "cards" | "notifications")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="cards">
          {t("myCards") || "Mes cartes"} ({cards.length})
        </TabsTrigger>
        <TabsTrigger value="notifications" className="relative">
          {t("notifications") || "Notifications"}
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cards" className="space-y-6">
        <MyCardsExplanation />
        
        {/* Show debug tools if user has the specific card */}
        {hasCard1234567890 && (
          <NotificationDebugButton cardNumber="1234567890" />
        )}
        
        {cardsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">{t("loading") || "Chargement..."}</p>
          </div>
        ) : (
          <UserCardsList
            cards={cards}
            onToggleStatus={onToggleCardStatus}
            onDeleteCard={onDeleteCard}
          />
        )}
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        {notificationsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">{t("loading") || "Chargement..."}</p>
          </div>
        ) : (
          <NotificationsList
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onDeleteAllNotifications={onDeleteAllNotifications}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};
