import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MCardMessage } from "@/types/mcard-verification";
import { ConversationsList } from "@/components/messages/ConversationsList";
import { ConversationView } from "@/components/messages/ConversationView";

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