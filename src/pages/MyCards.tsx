
import { useState } from "react";
import { Header } from "@/components/Header";
import { useUserCards } from "@/hooks/useUserCards";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationCleanup } from "@/hooks/useNotificationCleanup";
import { MyCardsHeader } from "@/components/cards/MyCardsHeader";
import { MyCardsTabsContent } from "@/components/cards/MyCardsTabsContent";
import { MyCardsAdModal } from "@/components/cards/MyCardsAdModal";
import { useMyCardsAutoAdd } from "@/hooks/useMyCardsAutoAdd";
import { useMyCardsNotifications } from "@/hooks/useMyCardsNotifications";

const MyCards = () => {
  const {
    cards,
    loading: cardsLoading,
    addCard,
    deleteCard,
    toggleCardStatus,
    refetch: refetchCards,
  } = useUserCards();
  
  const {
    notifications,
    loading: notificationsLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteAllNotifications,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<"cards" | "notifications">("cards");
  const [showAdModal, setShowAdModal] = useState(false);

  // Auto cleanup old notifications
  useNotificationCleanup();

  // Handle automatic card addition from URL params
  useMyCardsAutoAdd({
    cards,
    addCard,
    refetchCards,
    onShowAdModal: () => setShowAdModal(true),
  });

  // Handle notification tab switching
  useMyCardsNotifications({
    unreadCount,
    onSetActiveTab: setActiveTab,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <MyCardsHeader
            cardCount={cards.length}
            onAddCard={addCard}
            showBackButton={false}
          />

          <MyCardsTabsContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            cards={cards}
            cardsLoading={cardsLoading}
            notifications={notifications}
            notificationsLoading={notificationsLoading}
            unreadCount={unreadCount}
            onToggleCardStatus={toggleCardStatus}
            onDeleteCard={deleteCard}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onDeleteAllNotifications={deleteAllNotifications}
          />
        </div>
      </main>

      <MyCardsAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
      />
    </div>
  );
};

export default MyCards;
