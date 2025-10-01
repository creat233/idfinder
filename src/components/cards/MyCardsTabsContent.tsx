
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserCardsList } from "./UserCardsList";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { MyCardsExplanation } from "./MyCardsExplanation";
import { NotificationDebugButton } from "./NotificationDebugButton";
import { MyMCardsView } from "./MyMCardsView";
import { useTranslation } from "@/hooks/useTranslation";
import { useMCards } from "@/hooks/useMCards";
import { MCard } from "@/types/mcard";

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
  activeTab: "cards" | "notifications" | "mcards";
  onTabChange: (tab: "cards" | "notifications" | "mcards") => void;
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
  const { mcards, loading: mcardsLoading } = useMCards();

  // Check if user has the specific card number 1234567890
  const hasCard1234567890 = cards.some(card => card.card_number === "1234567890");

  const handleRefresh = () => {
    // Cette fonction peut être utilisée pour rafraîchir la liste des cartes
    // Pour l'instant, elle ne fait rien car la logique de rafraîchissement
    // est gérée au niveau parent
  };

  const handleEditMCard = (mcard: MCard) => {
    // Navigation vers l'édition de la MCard
    window.open(`/mcard/edit/${mcard.id}`, '_blank');
  };

  const handleShareMCard = (mcard: MCard) => {
    // Copier le lien de partage
    const shareUrl = `${window.location.origin}/m/${mcard.slug}`;
    navigator.clipboard.writeText(shareUrl);
    // Vous pouvez ajouter un toast ici pour confirmer la copie
  };

  const handleViewMCard = (mcard: MCard) => {
    // Navigation vers la vue de gestion pour les propriétaires
    window.location.href = `/mcard/${mcard.slug}`;
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "cards" | "notifications" | "mcards")}>
      <TabsList className="grid w-full grid-cols-3 h-auto">
        <TabsTrigger value="cards" className="text-xs sm:text-sm py-2">
          <span className="hidden sm:inline">{t("myCards") || "Mes cartes"} ({cards.length})</span>
          <span className="sm:hidden">Cartes ({cards.length})</span>
        </TabsTrigger>
        <TabsTrigger value="mcards" className="text-xs sm:text-sm py-2">
          <span className="hidden sm:inline">MCards ({mcards.length})</span>
          <span className="sm:hidden">MCards ({mcards.length})</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="relative text-xs sm:text-sm py-2">
          <span className="hidden sm:inline">{t("notifications") || "Notifications"}</span>
          <span className="sm:hidden">Notifs</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cards" className="space-y-4 sm:space-y-6 mt-4">
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
            onRefresh={handleRefresh}
          />
        )}
      </TabsContent>

      <TabsContent value="mcards" className="space-y-4 sm:space-y-6 mt-4">
        <MyMCardsView
          mcards={mcards}
          loading={mcardsLoading}
          onEdit={handleEditMCard}
          onShare={handleShareMCard}
          onView={handleViewMCard}
        />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4 sm:space-y-6 mt-4">
        {notificationsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">{t("loading") || "Chargement..."}</p>
          </div>
        ) : (
          <NotificationsList />
        )}
      </TabsContent>
    </Tabs>
  );
};
