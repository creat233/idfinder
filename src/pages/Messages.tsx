import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Clock, User } from "lucide-react";
import { getMessages, markMessageAsRead } from "@/services/mcardMessageService";
import { MCardMessage } from "@/types/mcard-verification";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const Messages = () => {
  const [messages, setMessages] = useState<MCardMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<MCardMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des messages:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos messages"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = async (message: MCardMessage) => {
    setSelectedMessage(message);
    
    if (!message.is_read) {
      await markMessageAsRead(message.id);
      setMessages(messages.map(msg => 
        msg.id === message.id ? { ...msg, is_read: true } : msg
      ));
    }
  };

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.is_read).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Chargement de vos messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            Mes Messages
          </h1>
          <p className="text-lg text-gray-600">
            Gérez vos conversations avec les propriétaires de MCard
          </p>
        </div>

        {/* Stats */}
        <div className="text-center mb-8 flex justify-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {messages.length} message{messages.length > 1 ? 's' : ''}
          </Badge>
          {getUnreadCount() > 0 && (
            <Badge variant="destructive" className="text-lg px-4 py-2">
              {getUnreadCount()} non lu{getUnreadCount() > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {messages.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun message</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => handleMessageClick(message)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 border-b transition-colors ${
                          selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                        } ${!message.is_read ? 'bg-blue-25 font-medium' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium truncate">
                                {message.sender_name || 'Utilisateur'}
                              </span>
                              {!message.is_read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {message.subject}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(message.created_at), { 
                                  addSuffix: true, 
                                  locale: fr 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
                      {!selectedMessage.is_read && (
                        <Badge variant="secondary">Nouveau</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        De: {selectedMessage.sender_name || 'Utilisateur'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDistanceToNow(new Date(selectedMessage.created_at), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </div>
                    </div>
                    {selectedMessage.mcard_name && (
                      <div className="text-sm text-gray-600">
                        Concernant: <span className="font-medium">{selectedMessage.mcard_name}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      Sélectionnez un message pour le lire
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;