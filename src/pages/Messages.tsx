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
  }, []);

  const handleSendMessage = async () => {
    await sendMessage(replyText, selectedConversation);
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
    <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="container mx-auto px-4 py-6 flex-1 flex flex-col max-w-7xl">
          <div className="text-center mb-6 flex-shrink-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              💬 Messages
            </h1>
            <p className="text-gray-600">Vos conversations avec les propriétaires et visiteurs de MCards</p>
          </div>

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