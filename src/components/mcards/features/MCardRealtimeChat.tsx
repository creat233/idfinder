import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

interface MCardRealtimeChatProps {
  mcardId: string;
  mcardOwnerId: string;
  mcardOwnerName: string;
  currentUserId: string;
  currentUserName: string;
}

export const MCardRealtimeChat = ({
  mcardId,
  mcardOwnerId,
  mcardOwnerName,
  currentUserId,
  currentUserName
}: MCardRealtimeChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Configuration du chat temps réel
  useEffect(() => {
    if (!isOpen) return;

    const channel = supabase
      .channel(`chat_${mcardId}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        setIsOnline(Object.keys(newState).includes(mcardOwnerId));
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key === mcardOwnerId) setIsOnline(true);
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key === mcardOwnerId) setIsOnline(false);
      })
      .on('broadcast', { event: 'new_message' }, (payload) => {
        const message = payload.payload as ChatMessage;
        setMessages(prev => [...prev, message]);
        
        if (message.sender_id !== currentUserId) {
          if (isMinimized) {
            setUnreadCount(prev => prev + 1);
          }
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Rejoindre la présence
          await channel.track({
            user_id: currentUserId,
            user_name: currentUserName,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, mcardId, mcardOwnerId, currentUserId, currentUserName, isMinimized]);

  // Charger l'historique des messages
  useEffect(() => {
    if (!isOpen) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('mcard_messages')
        .select('id, sender_id, message, created_at')
        .eq('mcard_id', mcardId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger l'historique"
        });
        return;
      }

      const formattedMessages = data.map(msg => ({
        id: msg.id,
        sender_id: msg.sender_id,
        sender_name: msg.sender_id === currentUserId ? currentUserName : mcardOwnerName,
        message: msg.message,
        created_at: msg.created_at
      }));

      setMessages(formattedMessages);
    };

    loadMessages();
  }, [isOpen, mcardId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      console.log('Envoi message chat en temps réel:', {
        sender_id: currentUserId,
        recipient_id: mcardOwnerId,
        mcard_id: mcardId
      });

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        sender_id: currentUserId,
        sender_name: currentUserName,
        message: newMessage.trim(),
        created_at: new Date().toISOString()
      };

      // Envoyer via Supabase
      const { data, error } = await supabase
        .from('mcard_messages')
        .insert({
          sender_id: currentUserId,
          recipient_id: mcardOwnerId,
          mcard_id: mcardId,
          message: newMessage.trim(),
          subject: 'Chat en temps réel'
        })
        .select();

      if (error) {
        console.error('Erreur envoi message chat:', error);
        console.error('Code d\'erreur:', error.code);
        console.error('Message d\'erreur:', error.message);
        
        let errorMessage = "Impossible d'envoyer le message";
        if (error.code === '23503') {
          errorMessage = "Le destinataire n'existe pas ou est invalide.";
        } else if (error.message?.includes('new row violates row-level security policy')) {
          errorMessage = "La carte n'est pas disponible pour recevoir des messages. Elle doit être publiée et active.";
        }
        
        throw new Error(errorMessage);
      }

      console.log('Message chat envoyé:', data);

      // Broadcast le message
      const channel = supabase.channel(`chat_${mcardId}`);
      await channel.send({
        type: 'broadcast',
        event: 'new_message',
        payload: message
      });

      setNewMessage('');
      
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé"
      });
    } catch (error: any) {
      console.error('Erreur complète chat:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le message"
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
    setUnreadCount(0);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
    setUnreadCount(0);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={openChat}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        size="sm"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-64 shadow-lg">
          <CardHeader className="pb-2 cursor-pointer" onClick={maximizeChat}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium text-sm">Chat avec {mcardOwnerName}</span>
                {unreadCount > 0 && (
                  <Badge className="h-5 w-5 rounded-full bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 h-96 shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="font-medium text-sm">Chat avec {mcardOwnerName}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              <Button
                variant="ghost"
                size="sm"
                onClick={minimizeChat}
                className="h-6 w-6 p-0"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className={isOnline ? 'text-green-600 font-medium' : 'text-gray-500'}>
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col h-80">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    message.sender_id === currentUserId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="break-words">{message.message}</div>
                  <div className={`text-xs mt-1 ${
                    message.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1"
                disabled={sending}
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sending}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};