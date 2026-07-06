import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Search } from "lucide-react";
import { Conversation } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";
import { AutoReplySettingsDialog } from "./AutoReplySettings";
import { SwipeableConversationItem } from "./SwipeableConversationItem";

interface ConversationsListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  loading: boolean;
  searchQuery: string;
  currentUserId: string;
  onSearchChange: (query: string) => void;
  onConversationSelect: (conversation: Conversation) => void;
}

export function ConversationsList({
  conversations,
  selectedConversation,
  loading,
  searchQuery,
  currentUserId,
  onSearchChange,
  onConversationSelect
}: ConversationsListProps) {
  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.mcardName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full overflow-hidden">
        {/* Header avec recherche et paramètres */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <AutoReplySettingsDialog userId={currentUserId} />
          </div>
        </div>

        {/* Liste des conversations avec scroll */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-sm">
                {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
              </p>
            </div>
          ) : (
            <div className="space-y-1 pb-4">
              {filteredConversations.map((conversation) => (
                <SwipeableConversationItem
                  key={conversation.otherUserId}
                  otherUserId={conversation.otherUserId}
                  currentUserId={currentUserId}
                  onDeleted={() => window.dispatchEvent(new CustomEvent('conversationDeleted'))}
                >
                <div
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 bg-white ${
                    selectedConversation?.otherUserId === conversation.otherUserId
                      ? 'bg-blue-50 border-l-blue-500' 
                      : 'border-l-transparent'
                  }`}
                  onClick={async () => {
                    // Marquer TOUS les messages de cette conversation comme lus AVANT de sélectionner
                    if (conversation.unreadCount > 0) {
                      try {
                        // Marquer tous les messages non lus de cet expéditeur vers le destinataire actuel
                        const { error } = await supabase
                          .from('mcard_messages')
                          .update({ is_read: true })
                          .eq('sender_id', conversation.otherUserId)
                          .eq('recipient_id', currentUserId)
                          .eq('is_read', false);
                        
                        if (error) {
                          console.error('❌ Erreur marquage messages:', error);
                        } else {
                          console.log('✅ Messages marqués comme lus avec succès');
                        }
                      } catch (error) {
                        console.error('❌ Erreur marquage messages:', error);
                      }
                    }
                    
                    // Sélectionner la conversation
                    onConversationSelect(conversation);
                    
                    // Forcer le rechargement du compteur après un délai
                    setTimeout(() => {
                      console.log('🔄 Rechargement forcé du compteur');
                      window.dispatchEvent(new CustomEvent('messagesMarkedAsRead'));
                    }, 300);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (conversation.mcardSlug) {
                          window.open(`${window.location.origin}/mcard/${conversation.mcardSlug}`, '_blank');
                        }
                      }}
                      disabled={!conversation.mcardSlug}
                      className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ${conversation.mcardSlug ? 'cursor-pointer hover:ring-2 hover:ring-blue-400 transition' : ''}`}
                      title={conversation.mcardSlug ? "Voir la MCard" : undefined}
                      aria-label="Voir la MCard"
                    >
                      {conversation.mcardProfilePicture ? (
                        <img src={conversation.mcardProfilePicture} alt={conversation.otherUserName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {conversation.otherUserName.charAt(0) || 'U'}
                        </div>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {conversation.otherUserName}
                        </h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {conversation.unreadCount > 0 && (
                            <div className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conversation.unreadCount}
                            </div>
                          )}
                           <span className="text-xs text-gray-500">
                            {new Date(conversation.lastMessage.created_at).toLocaleDateString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-1 truncate">
                        MCard: {conversation.mcardName}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-1">
                        {conversation.lastMessage.sender_id === currentUserId ? 'Vous: ' : ''}
                        {conversation.lastMessage.message}
                      </p>
                    </div>
                  </div>
                </div>
                </SwipeableConversationItem>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}