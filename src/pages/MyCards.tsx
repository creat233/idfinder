
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserCards } from "@/hooks/useUserCards";
import { useNotifications } from "@/hooks/useNotifications";
import { AddCardDialog } from "@/components/cards/AddCardDialog";
import { UserCardsList } from "@/components/cards/UserCardsList";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useRef, useState } from "react";

const MyCards = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    cards,
    loading: cardsLoading,
    addCard,
    deleteCard,
    toggleCardStatus,
  } = useUserCards();
  
  const {
    notifications,
    loading: notificationsLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // --- Ajout : gestion de l’état du tab actif
  const [activeTab, setActiveTab] = useState<"cards" | "notifications">("cards");
  const prevUnreadCount = useRef(unreadCount);
  const isFirstLoad = useRef(true);

  // --- Gérer l'ouverture automatique de la modale Ajouter une carte si ?ajouter=xxx
  const [searchParams, setSearchParams] = useSearchParams();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [prefillCardNumber, setPrefillCardNumber] = useState<string | undefined>(undefined);

  useEffect(() => {
    const cardToAdd = searchParams.get("ajouter");
    if (cardToAdd) {
      setPrefillCardNumber(cardToAdd);
      setAddDialogOpen(true);
      // Nettoyer l’URL après ouverture pour éviter réouverture automatique si on reste sur page :
      searchParams.delete("ajouter");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    // Si une nouvelle notification non lue arrive, passer sur le tab "notifications".
    if (!isFirstLoad.current && unreadCount > prevUnreadCount.current) {
      setActiveTab("notifications");
    }
    prevUnreadCount.current = unreadCount;
    isFirstLoad.current = false;
  }, [unreadCount]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("back") || "Retour"}
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{t("myCards") || "Mes cartes"}</h1>
            <AddCardDialog
              onAddCard={addCard}
              open={addDialogOpen}
              setOpen={setAddDialogOpen}
              prefillCardNumber={prefillCardNumber}
            />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "cards" | "notifications")}
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    {t("howItWorks") || "Comment ça marche ?"}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {t("cardsExplanation") || "Ajoutez les numéros de vos cartes d'identité pour recevoir automatiquement une notification si quelqu'un les signale comme trouvées sur FinderID. Vous pourrez ainsi les récupérer rapidement."}
                  </p>
                </div>

                {cardsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">{t("loading") || "Chargement..."}</p>
                  </div>
                ) : (
                  <UserCardsList
                    cards={cards}
                    onToggleStatus={toggleCardStatus}
                    onDeleteCard={deleteCard}
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
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MyCards;

