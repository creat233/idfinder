import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageCircle, Search, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MCardMessage } from "@/types/mcard-verification";

interface Conversation {
  otherUserId: string;
  otherUserName: string;
  mcardId: string;
  mcardName: string;
  messages: MCardMessage[];
  lastMessage: MCardMessage;
  unreadCount: number;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (user) {
      loadConversations();
      
      // Configurer l'écoute en temps réel des nouveaux messages
      const channel = supabase
        .channel('messages-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'mcard_messages',
            filter: `sender_id=eq.${user.id},recipient_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Message update:', payload);
            loadConversations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('mcard_messages')
        .select(`
          *,
          mcards!mcard_messages_mcard_id_fkey(full_name)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Récupérer les noms des utilisateurs
      const userIds = [...new Set([...data?.map(msg => msg.sender_id) || [], ...data?.map(msg => msg.recipient_id) || []])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      const processedMessages = data?.map((msg: any) => {
        const senderProfile = profiles?.find(p => p.id === msg.sender_id);
        const recipientProfile = profiles?.find(p => p.id === msg.recipient_id);
        
        return {
          ...msg,
          sender_name: senderProfile ? `${senderProfile.first_name || ''} ${senderProfile.last_name || ''}`.trim() || 'Utilisateur' : 'Utilisateur',
          recipient_name: recipientProfile ? `${recipientProfile.first_name || ''} ${recipientProfile.last_name || ''}`.trim() || 'Utilisateur' : 'Utilisateur',
          mcard_name: msg.mcards?.full_name || 'Carte supprimée'
        };
      }) || [];

      // Grouper les messages par conversation
      const conversationsMap = new Map<string, Conversation>();
      
      processedMessages.forEach((msg: any) => {
        const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        const otherUserName = msg.sender_id === user.id ? msg.recipient_name : msg.sender_name;
        const key = `${otherUserId}-${msg.mcard_id}`;
        
        if (!conversationsMap.has(key)) {
          conversationsMap.set(key, {
            otherUserId,
            otherUserName,
            mcardId: msg.mcard_id,
            mcardName: msg.mcard_name,
            messages: [],
            lastMessage: msg,
            unreadCount: 0
          });
        }
        
        const conversation = conversationsMap.get(key)!;
        conversation.messages.push(msg);
        
        // Compter les messages non lus reçus
        if (msg.recipient_id === user.id && !msg.is_read) {
          conversation.unreadCount++;
        }
        
        // Mettre à jour le dernier message si plus récent
        if (new Date(msg.created_at) > new Date(conversation.lastMessage.created_at)) {
          conversation.lastMessage = msg;
        }
      });

      // Trier les messages dans chaque conversation par date croissante
      conversationsMap.forEach(conversation => {
        conversation.messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      });

      const conversationsList = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime());

      setConversations(conversationsList);
    } catch (error: any) {
      console.error('Erreur lors du chargement:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les conversations"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() || !user || !selectedConversation) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('mcard_messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedConversation.otherUserId,
          mcard_id: selectedConversation.mcardId,
          subject: selectedConversation.messages.length === 0 ? 'Nouveau message' : `Re: ${selectedConversation.messages[0]?.subject || 'Message'}`,
          message: replyText
        });

      if (error) throw error;

      toast({
        title: "✅ Message envoyé",
        description: "Votre message a été envoyé avec succès"
      });

      setReplyText("");
      loadConversations();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le message"
      });
    } finally {
      setSending(false);
    }
  };

  const markConversationAsRead = async (conversation: Conversation) => {
    if (!user) return;

    try {
      // Marquer tous les messages non lus de cette conversation comme lus
      await supabase
        .from('mcard_messages')
        .update({ is_read: true })
        .eq('mcard_id', conversation.mcardId)
        .eq('sender_id', conversation.otherUserId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);
      
      loadConversations();
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.mcardName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              💬 Messages
            </h1>
            <p className="text-gray-600">Vos conversations avec les propriétaires et visiteurs de MCards</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Liste des conversations */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardContent className="p-0">
                  {/* Barre de recherche */}
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher une conversation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Liste des conversations */}
                  <div className="overflow-y-auto h-[calc(100%-80px)]">
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
                      <div className="space-y-1">
                        {filteredConversations.map((conversation) => (
                          <div
                            key={`${conversation.otherUserId}-${conversation.mcardId}`}
                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                              selectedConversation?.otherUserId === conversation.otherUserId && 
                              selectedConversation?.mcardId === conversation.mcardId
                                ? 'bg-blue-50 border-l-blue-500' 
                                : 'border-l-transparent'
                            }`}
                            onClick={() => {
                              setSelectedConversation(conversation);
                              markConversationAsRead(conversation);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {conversation.otherUserName.charAt(0) || 'U'}
                              </div>
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
                                      {new Date(conversation.lastMessage.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 mb-1 truncate">
                                  MCard: {conversation.mcardName}
                                </p>
                                <p className="text-sm text-gray-700 line-clamp-1">
                                  {conversation.lastMessage.sender_id === user.id ? 'Vous: ' : ''}
                                  {conversation.lastMessage.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Zone de conversation */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                {selectedConversation ? (
                  <div className="h-full flex flex-col">
                    {/* En-tête de la conversation */}
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedConversation(null)}
                            className="lg:hidden"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {selectedConversation.otherUserName.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h2 className="font-semibold text-gray-900">{selectedConversation.otherUserName}</h2>
                            <p className="text-sm text-gray-500">MCard: {selectedConversation.mcardName}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                              message.sender_id === user.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {message.subject && (
                              <p className={`font-medium text-sm mb-1 ${
                                message.sender_id === user.id ? 'text-blue-100' : 'text-gray-600'
                              }`}>
                                {message.subject}
                              </p>
                            )}
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-2 ${
                              message.sender_id === user.id ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {new Date(message.created_at).toLocaleString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Zone de saisie */}
                    <div className="p-4 border-t bg-gray-50">
                      <div className="flex gap-3">
                        <Textarea
                          placeholder="Tapez votre message..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={2}
                          className="flex-1 resize-none"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!replyText.trim() || sending}
                          className="self-end"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
                      <p className="text-sm">Choisissez une conversation dans la liste pour commencer à discuter</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Messages;