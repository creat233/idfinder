import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageCircle, User, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MCardMessage } from "@/types/mcard-verification";

const Messages = () => {
  const [messages, setMessages] = useState<MCardMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<MCardMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (user) {
      loadMessages();
      
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
            loadMessages(); // Recharger les messages quand il y a des changements
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;
    
    try {
      console.log('Chargement des messages pour utilisateur:', user.id);
      
      const { data, error } = await supabase
        .from('mcard_messages')
        .select(`
          *,
          mcards!mcard_messages_mcard_id_fkey(full_name)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      console.log('Messages récupérés:', data);

      if (error) throw error;

      // Récupérer les noms des utilisateurs séparément
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

      setMessages(processedMessages);
    } catch (error: any) {
      console.error('Erreur lors du chargement:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les messages"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim() || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('mcard_messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedMessage.sender_id === user.id ? selectedMessage.recipient_id : selectedMessage.sender_id,
          mcard_id: selectedMessage.mcard_id,
          subject: `Re: ${selectedMessage.subject || 'Message'}`,
          message: replyText
        });

      if (error) throw error;

      toast({
        title: "✅ Message envoyé",
        description: "Votre réponse a été envoyée avec succès"
      });

      setReplyText("");
      setSelectedMessage(null);
      loadMessages();
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

  const markAsRead = async (messageId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('mcard_messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('recipient_id', user.id);
      
      loadMessages();
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
    }
  };

  const receivedMessages = messages.filter(msg => msg.recipient_id === user?.id);
  const sentMessages = messages.filter(msg => msg.sender_id === user?.id);
  const unreadCount = receivedMessages.filter(msg => !msg.is_read).length;

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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                💬 Messages
              </h1>
              <p className="text-gray-600">Vos conversations avec les propriétaires et visiteurs de MCards</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun message</h3>
                <p className="text-gray-500">Vous n'avez pas encore de conversations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card 
                    key={message.id} 
                    className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                      !message.is_read && message.recipient_id === user?.id 
                        ? 'ring-2 ring-blue-200 bg-blue-50/50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      // Navigation vers la page de conversation
                      const otherUserId = message.sender_id === user?.id ? message.recipient_id : message.sender_id;
                      const otherUserName = message.sender_id === user?.id ? message.recipient_name : message.sender_name;
                      window.location.href = `/conversation/${otherUserId}?mcard=${message.mcard_id}&name=${encodeURIComponent(otherUserName || '')}`;
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {(message.sender_id === user?.id ? message.recipient_name : message.sender_name)?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {message.sender_id === user?.id ? message.recipient_name : message.sender_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              MCard: {message.mcard_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!message.is_read && message.recipient_id === user?.id && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      
                      {message.subject && (
                        <h4 className="font-medium text-gray-800 mb-2">{message.subject}</h4>
                      )}
                      
                      <p className="text-gray-700 line-clamp-2 text-sm leading-relaxed">
                        {message.sender_id === user?.id ? 'Vous: ' : ''}{message.message}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Messages;