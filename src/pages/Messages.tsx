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
import { supabase } from "@/integrations/supabase/client";

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
    }
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('mcard_messages')
        .select(`
          *,
          sender:profiles!mcard_messages_sender_id_fkey(first_name, last_name),
          recipient:profiles!mcard_messages_recipient_id_fkey(first_name, last_name),
          mcard:mcards!mcard_messages_mcard_id_fkey(full_name)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedMessages = data?.map((msg: any) => ({
        ...msg,
        sender_name: msg.sender ? `${msg.sender.first_name} ${msg.sender.last_name || ''}`.trim() : 'Utilisateur',
        recipient_name: msg.recipient ? `${msg.recipient.first_name} ${msg.recipient.last_name || ''}`.trim() : 'Utilisateur',
        mcard_name: msg.mcard?.full_name || 'Carte supprimée'
      })) || [];

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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              💬 Mes Messages
            </h1>
            <p className="text-gray-600">Gérez vos conversations avec les propriétaires et visiteurs de MCards</p>
          </div>

          <Tabs defaultValue="received" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="received" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Messages reçus {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Messages envoyés
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Liste des messages */}
              <div className="lg:col-span-2">
                <TabsContent value="received">
                  <Card>
                    <CardHeader>
                      <CardTitle>Messages reçus ({receivedMessages.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-8">Chargement...</div>
                      ) : receivedMessages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Aucun message reçu</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {receivedMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${
                                !message.is_read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                              } ${selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''}`}
                              onClick={() => {
                                setSelectedMessage(message);
                                if (!message.is_read) markAsRead(message.id);
                              }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">{message.sender_name}</span>
                                  {!message.is_read && (
                                    <Badge variant="default" className="text-xs">Nouveau</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {new Date(message.created_at).toLocaleDateString()}
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>MCard:</strong> {message.mcard_name}
                              </p>
                              
                              {message.subject && (
                                <p className="font-medium text-sm mb-1">{message.subject}</p>
                              )}
                              
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {message.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sent">
                  <Card>
                    <CardHeader>
                      <CardTitle>Messages envoyés ({sentMessages.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {sentMessages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Send className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Aucun message envoyé</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {sentMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`border rounded-lg p-4 cursor-pointer hover:shadow-md hover:bg-gray-50 transition-all ${
                                selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''
                              }`}
                              onClick={() => setSelectedMessage(message)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">À:</span>
                                  <span className="font-medium">{message.recipient_name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {new Date(message.created_at).toLocaleDateString()}
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>MCard:</strong> {message.mcard_name}
                              </p>
                              
                              {message.subject && (
                                <p className="font-medium text-sm mb-1">{message.subject}</p>
                              )}
                              
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {message.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              {/* Détail du message et réponse */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedMessage ? 'Détails du message' : 'Sélectionnez un message'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedMessage ? (
                      <div className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <div><strong>De:</strong> {selectedMessage.sender_name}</div>
                          <div><strong>À:</strong> {selectedMessage.recipient_name}</div>
                          <div><strong>MCard:</strong> {selectedMessage.mcard_name}</div>
                          <div><strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString()}</div>
                        </div>
                        
                        {selectedMessage.subject && (
                          <div>
                            <strong className="text-sm">Sujet:</strong>
                            <p className="mt-1">{selectedMessage.subject}</p>
                          </div>
                        )}
                        
                        <div>
                          <strong className="text-sm">Message:</strong>
                          <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                            {selectedMessage.message}
                          </div>
                        </div>

                        {/* Formulaire de réponse */}
                        <div className="pt-4 border-t space-y-3">
                          <strong className="text-sm">Répondre:</strong>
                          <Textarea
                            placeholder="Tapez votre réponse..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                          />
                          <Button
                            onClick={handleReply}
                            disabled={!replyText.trim() || sending}
                            className="w-full"
                            size="sm"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            {sending ? 'Envoi...' : 'Envoyer la réponse'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Cliquez sur un message pour voir les détails</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Messages;