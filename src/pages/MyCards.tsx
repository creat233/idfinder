
import { useState } from "react";
import { Header } from "@/components/Header";
import { useUserCards } from "@/hooks/useUserCards";
import { useNotifications } from "@/hooks/useNotifications";
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
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<"cards" | "notifications">("cards");
  const [showAdModal, setShowAdModal] = useState(false);

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
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <MyCardsHeader
            cardCount={cards.length}
            onAddCard={addCard}
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
