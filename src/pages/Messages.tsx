import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ConversationsList } from "@/components/messages/ConversationsList";
import { ConversationView } from "@/components/messages/ConversationView";
import { MomoAI } from "@/components/messages/MomoAI";
import { MomoAIChat } from "@/components/messages/MomoAIChat";
import { useConversations } from "@/hooks/useConversations";
import { useMessageSender } from "@/hooks/useMessageSender";
import { Conversation } from "@/types/messages";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";

const Messages = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuthState();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showMomoChat, setShowMomoChat] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Rediriger vers la page de connexion si non authentifié
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Custom hooks pour gérer les conversations et l'envoi de messages
  const { conversations, loading, loadConversations, markConversationAsRead, deleteMessage } = useConversations(user);
  const { sending, sendMessage } = useMessageSender(user, () => {
    setReplyText("");
    loadConversations();
  });

  // Émettre un événement quand l'état de la conversation change et forcer le rechargement des messages non lus
  useEffect(() => {
    const event = new CustomEvent('conversationStateChange', {
      detail: { hasSelectedConversation: !!selectedConversation }
    });
    window.dispatchEvent(event);
    
    // Forcer le rechargement du compteur après changement de conversation
    if (selectedConversation) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('messagesMarkedAsRead'));
      }, 500);
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Vérifier s'il y a un message en attente depuis un produit
    if (user) {
      const pendingMessage = localStorage.getItem('pendingMessage');
      if (pendingMessage) {
        try {
          const messageData = JSON.parse(pendingMessage);
          // Auto-ouvrir la conversation avec ce contexte
          // Ceci sera géré par le composant ConversationsList
          localStorage.removeItem('pendingMessage'); // Nettoyer après utilisation
        } catch (error) {
          console.error('Erreur parsing pendingMessage:', error);
          localStorage.removeItem('pendingMessage');
        }
      }
    }
  }, [user]);

  const handleSendMessage = async () => {
    await sendMessage(replyText, selectedConversation);
  };

  const handleBlockUser = async (userId: string) => {
    console.log("Blocking user:", userId);
    // Logique de blocage à implémenter
  };

  const handleUnblockUser = async (userId: string) => {
    console.log("Unblocking user:", userId);
    // Logique de déblocage à implémenter
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversation) return;
    
    try {
      // Logique de suppression de conversation
      setSelectedConversation(null);
      loadConversations();
    } catch (error) {
      console.error("Erreur lors de la suppression de la conversation:", error);
    }
  };

  // Afficher un message de chargement pendant la vérification d'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, la redirection se fait dans useEffect
  // En attendant, on peut afficher un message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
            <p>Vous devez être connecté pour accéder à vos messages.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header masqué complètement sur mobile quand conversation ouverte */}
      <div className={selectedConversation ? "hidden lg:block" : "block"}>
        <Header />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col w-full h-full">
          <div className="flex-1 min-h-0">
            {showMomoChat ? (
              <MomoAIChat 
                onBack={() => setShowMomoChat(false)}
              />
            ) : (
              <div className="h-full lg:grid lg:grid-cols-12 lg:gap-0">
                {/* Liste des conversations - mobile: full width si pas de conversation sélectionnée */}
                <div className={`${
                  selectedConversation 
                    ? "hidden lg:block lg:col-span-4 xl:col-span-3" 
                    : "lg:col-span-4 xl:col-span-3"
                } flex flex-col h-full`}>
                  <ConversationsList
                    conversations={conversations}
                    loading={loading}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedConversation={selectedConversation}
                    onConversationSelect={setSelectedConversation}
                    currentUserId={user?.id || ""}
                  />
                </div>

                {/* Vue de conversation - mobile: full width si conversation sélectionnée */}
                <div className={`${
                  selectedConversation 
                    ? "lg:col-span-8 xl:col-span-9" 
                    : "hidden lg:flex lg:col-span-8 xl:col-span-9"
                } flex flex-col h-full`}>
                  {selectedConversation ? (
                    <ConversationView
                      conversation={selectedConversation}
                      currentUserId={user?.id || ""}
                      replyText={replyText}
                      onReplyChange={setReplyText}
                      onSendMessage={handleSendMessage}
                      onBack={() => setSelectedConversation(null)}
                      onBlockUser={handleBlockUser}
                      onUnblockUser={handleUnblockUser}
                      onDeleteConversation={handleDeleteConversation}
                      onDeleteMessage={deleteMessage}
                      sending={sending}
                    />
                  ) : (
                    <div className="hidden lg:flex flex-col items-center justify-center h-full p-8 text-center bg-white/50 backdrop-blur-sm">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Sélectionnez une conversation
                      </h3>
                      <p className="text-gray-600 max-w-md">
                        Choisissez une conversation dans la liste pour commencer à échanger des messages
                      </p>
                      
                      <div className="mt-8">
                        <MomoAI onStartChat={() => setShowMomoChat(true)} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;