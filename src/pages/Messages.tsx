import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { ConversationsList } from "@/components/messages/ConversationsList";
import { ConversationView } from "@/components/messages/ConversationView";
import { useConversations } from "@/hooks/useConversations";
import { useMessageSender } from "@/hooks/useMessageSender";
import { Conversation } from "@/types/messages";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);

  // Custom hooks pour gérer les conversations et l'envoi de messages
  const { conversations, loading, loadConversations, markConversationAsRead, deleteMessage } = useConversations(user);
  const { sending, sendMessage } = useMessageSender(user, () => {
    setReplyText("");
    loadConversations();
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    
    // Vérifier s'il y a un message en attente depuis un produit
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
  }, []);

  const handleSendMessage = async () => {
    await sendMessage(replyText, selectedConversation);
  };

  const handleBlockUser = async (userId: string) => {
    if (!selectedConversation) return;
    
    try {
      const { error } = await supabase
        .from('mcard_blocked_users')
        .insert({
          mcard_id: selectedConversation.mcardId,
          blocked_user_id: userId
        });

      if (error) throw error;

      // Recharger les conversations pour refléter le changement
      loadConversations();
    } catch (error) {
      console.error('Erreur lors du blocage:', error);
      alert('Erreur lors du blocage de l\'utilisateur');
    }
  };

  const handleUnblockUser = async (userId: string) => {
    if (!selectedConversation) return;
    
    try {
      const { error } = await supabase
        .from('mcard_blocked_users')
        .delete()
        .eq('mcard_id', selectedConversation.mcardId)
        .eq('blocked_user_id', userId);

      if (error) throw error;

      // Recharger les conversations pour refléter le changement
      loadConversations();
    } catch (error) {
      console.error('Erreur lors du déblocage:', error);
      alert('Erreur lors du déblocage de l\'utilisateur');
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversation) return;
    
    try {
      // Supprimer tous les messages de la conversation
      const { error } = await supabase
        .from('mcard_messages')
        .delete()
        .eq('mcard_id', selectedConversation.mcardId)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

      if (error) throw error;

      // Réinitialiser la conversation sélectionnée
      setSelectedConversation(null);
      
      // Recharger les conversations pour refléter le changement
      loadConversations();
    } catch (error) {
      console.error('Erreur lors de la suppression de la conversation:', error);
      alert('Erreur lors de la suppression de la conversation');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col w-full h-full">
          <div className="flex-1 min-h-0">
            {/* Vue mobile */}
            <div className="lg:hidden h-full">
              {selectedConversation ? (
                <ConversationView
                  conversation={selectedConversation}
                  currentUserId={user.id}
                  replyText={replyText}
                  sending={sending}
                  onReplyChange={setReplyText}
                  onSendMessage={handleSendMessage}
                  onBack={() => setSelectedConversation(null)}
                  onDeleteMessage={deleteMessage}
                  onBlockUser={handleBlockUser}
                  onUnblockUser={handleUnblockUser}
                  onDeleteConversation={handleDeleteConversation}
                />
              ) : (
                <ConversationsList
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  loading={loading}
                  searchQuery={searchQuery}
                  currentUserId={user.id}
                  onSearchChange={setSearchQuery}
                  onConversationSelect={(conversation) => {
                    setSelectedConversation(conversation);
                    markConversationAsRead(conversation);
                  }}
                />
              )}
            </div>

            {/* Vue desktop */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6 h-full">
              {/* Liste des conversations */}
              <div className="lg:col-span-1">
                <ConversationsList
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  loading={loading}
                  searchQuery={searchQuery}
                  currentUserId={user.id}
                  onSearchChange={setSearchQuery}
                  onConversationSelect={(conversation) => {
                    setSelectedConversation(conversation);
                    markConversationAsRead(conversation);
                  }}
                />
              </div>

              {/* Zone de conversation */}
              <div className="lg:col-span-2">
                <ConversationView
                  conversation={selectedConversation}
                  currentUserId={user.id}
                  replyText={replyText}
                  sending={sending}
                  onReplyChange={setReplyText}
                  onSendMessage={handleSendMessage}
                  onBack={() => setSelectedConversation(null)}
                  onDeleteMessage={deleteMessage}
                  onBlockUser={handleBlockUser}
                  onUnblockUser={handleUnblockUser}
                  onDeleteConversation={handleDeleteConversation}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;