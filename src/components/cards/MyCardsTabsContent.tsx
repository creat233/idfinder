
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCardsList } from "./UserCardsList";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { MyCardsExplanation } from "./MyCardsExplanation";
import { useTranslation } from "@/hooks/useTranslation";

interface MyCardsTabsContentProps {
  activeTab: "cards" | "notifications";
  onTabChange: (tab: "cards" | "notifications") => void;
  cards: any[];
  cardsLoading: boolean;
  notifications: any[];
  notificationsLoading: boolean;
  unreadCount: number;
  onToggleCardStatus: (id: string) => Promise<void>;
  onDeleteCard: (id: string) => Promise<void>;
  onMarkAsRead: (id: string) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
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
}: MyCardsTabsContentProps) => {
  const { t } = useTranslation();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as "cards" | "notifications")}
      className="space-y-6"
    >
      <TabsList>
        <TabsTrigger value="cards">
          {t("myCards") || "Mes cartes"} ({cards.length})
        </TabsTrigger>
        <TabsTrigger value="notifications">
          {t("notifications") || "Notifications"}
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cards">
        <div className="space-y-6">
          <MyCardsExplanation />

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
        </div>
      </TabsContent>

      <TabsContent value="notifications">
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
          />
        )}
      </TabsContent>
    </Tabs>
  );
};
