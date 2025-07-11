import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, ArrowLeft, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MCardMessage } from "@/types/mcard-verification";

const Conversation = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mcardId = searchParams.get('mcard');
  const otherUserName = searchParams.get('name');
  
  const [messages, setMessages] = useState<MCardMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [mcardInfo, setMcardInfo] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (user && userId && mcardId) {
      loadConversation();
      loadMcardInfo();
      
      // Marquer les messages comme lus
      markConversationAsRead();
      
      // Configurer l'écoute en temps réel
      const channel = supabase
        .channel('conversation-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'mcard_messages',
            filter: `mcard_id=eq.${mcardId}`
          },
          (payload) => {
            loadConversation();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, userId, mcardId]);

  const loadConversation = async () => {
    if (!user || !userId || !mcardId) return;
    
    try {
      const { data, error } = await supabase
        .from('mcard_messages')
        .select(`
          *,
          mcards!mcard_messages_mcard_id_fkey(full_name)
        `)
        .eq('mcard_id', mcardId)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Récupérer les noms des utilisateurs
      const userIds = [user.id, userId];
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
        description: "Impossible de charger la conversation"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMcardInfo = async () => {
    if (!mcardId) return;
    
    try {
      const { data, error } = await supabase
        .from('mcards')
        .select('full_name, slug')
        .eq('id', mcardId)
        .single();

      if (error) throw error;
      setMcardInfo(data);
    } catch (error) {
      console.error('Erreur lors du chargement MCard:', error);
    }
  };

  const markConversationAsRead = async () => {
    if (!user || !userId || !mcardId) return;

    try {
      await supabase
        .from('mcard_messages')
        .update({ is_read: true })
        .eq('mcard_id', mcardId)
        .eq('sender_id', userId)
        .eq('recipient_id', user.id);
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() || !user || !userId || !mcardId) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('mcard_messages')
        .insert({
          sender_id: user.id,
          recipient_id: userId,
          mcard_id: mcardId,
          subject: messages.length === 0 ? 'Nouveau message' : `Re: ${messages[0]?.subject || 'Message'}`,
          message: replyText
        });

      if (error) throw error;

      toast({
        title: "✅ Message envoyé",
        description: "Votre message a été envoyé avec succès"
      });

      setReplyText("");
      loadConversation();
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
            <p>Vous devez être connecté pour accéder aux conversations.</p>
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
          {/* En-tête de la conversation */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/messages')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                  </Button>
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {otherUserName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h1 className="text-xl font-semibold">{otherUserName || 'Utilisateur'}</h1>
                        <p className="text-sm text-gray-500 font-normal">
                          MCard: {mcardInfo?.full_name || 'Carte supprimée'}
                        </p>
                      </div>
                    </CardTitle>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Messages */}
          <Card className="mb-6">
            <CardContent className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement de la conversation...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun message dans cette conversation</p>
                  <p className="text-sm mt-2">Commencez la conversation en envoyant un message ci-dessous</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
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
                          {new Date(message.created_at).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulaire de réponse */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Tapez votre message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!replyText.trim() || sending}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {sending ? 'Envoi...' : 'Envoyer'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Conversation;