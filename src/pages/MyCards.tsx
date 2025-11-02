
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useUserCards } from "@/hooks/useUserCards";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationCleanup } from "@/hooks/useNotificationCleanup";
import { MyCardsHeader } from "@/components/cards/MyCardsHeader";
import { MyCardsTabsContent } from "@/components/cards/MyCardsTabsContent";
import { MyCardsAdModal } from "@/components/cards/MyCardsAdModal";
import { useMyCardsAutoAdd } from "@/hooks/useMyCardsAutoAdd";
import { useMyCardsNotifications } from "@/hooks/useMyCardsNotifications";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { offlineStorage } from "@/services/offlineStorage";
import { supabase } from "@/integrations/supabase/client";

const MyCards = () => {
  const { isOnline } = useOfflineSync();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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

  const [activeTab, setActiveTab] = useState<"cards" | "notifications" | "mcards">("cards");
  const [showAdModal, setShowAdModal] = useState(false);

  // Vérifier la session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    checkSession();
  }, []);

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

  // Mode hors ligne sans session
  if (!session && !isOnline && !loading) {
    const offlineCards = offlineStorage.getAllUserCards();
    
    return (
      <div className="min-h-screen bg-background pb-24 md:pb-0">
        <Header />
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full overflow-x-hidden">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <MyCardsHeader
              cardCount={offlineCards.length}
              onAddCard={addCard}
              showBackButton={false}
            />

            <MyCardsTabsContent
              activeTab={activeTab}
              onTabChange={setActiveTab}
              cards={offlineCards}
              cardsLoading={false}
              notifications={[]}
              notificationsLoading={false}
              unreadCount={0}
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
  }

  // Si pas de session et en ligne, rediriger
  if (!session && !loading) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full overflow-x-hidden">
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
