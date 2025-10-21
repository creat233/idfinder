import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, AlertCircle, Clock, CheckCircle, ExternalLink, ShoppingCart } from "lucide-react";
import { AdminNavigation } from "./AdminNavigation";
import { useNavigate } from "react-router-dom";

interface AdminMessage {
  id: string;
  card_id: string;
  message_type: string;
  title: string;
  content: string;
  card_info: any;
  owner_info: any;
  promo_info: any;
  price_info: any;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'processed';
  created_at: string;
  processed_at?: string;
  processed_by?: string;
}

interface MCardMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  mcard_id: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  recipient_name?: string;
  mcard_name?: string;
}

export const AdminMessages = () => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [mcardMessages, setMcardMessages] = useState<MCardMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<AdminMessage[]>([]);
  const [filteredMcardMessages, setFilteredMcardMessages] = useState<MCardMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
  const [response, setResponse] = useState("");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewMCard = async (mcardId: string) => {
    try {
      const { data, error } = await supabase
        .from('mcards')
        .select('slug')
        .eq('id', mcardId)
        .single();

      if (error) throw error;
      if (data?.slug) {
        navigate(`/mcard/${data.slug}`);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la mCard"
      });
    }
  };

  const fetchMessages = async () => {
    try {
      // Fetch admin messages
      const { data: adminData, error: adminError } = await supabase
        .from('admin_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (adminError) throw adminError;
      setMessages(adminData as AdminMessage[] || []);
      setFilteredMessages(adminData as AdminMessage[] || []);

      // Fetch mcard messages
      const { data: mcardData, error: mcardError } = await supabase
        .from('mcard_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (mcardError) throw mcardError;
      
      const processedMcardMessages = (mcardData || []).map(msg => ({
        ...msg,
        sender_name: 'Client',
        mcard_name: 'mCard'
      }));
      
      setMcardMessages(processedMcardMessages);
      setFilteredMcardMessages(processedMcardMessages);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les messages"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const filteredAdmin = messages.filter(message =>
      message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.card_info?.card_number || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMessages(filteredAdmin);

    const filteredMcard = mcardMessages.filter(message =>
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.sender_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.mcard_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMcardMessages(filteredMcard);
  }, [searchTerm, messages, mcardMessages]);

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('admin_messages')
        .update({ status: 'read' })
        .eq('id', messageId);

      if (error) throw error;
      fetchMessages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer comme lu"
      });
    }
  };

  const processMessage = async (messageId: string) => {
    if (!response.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir une réponse"
      });
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('admin_messages')
        .update({ 
          status: 'processed',
          processed_at: new Date().toISOString(),
          metadata: { response: response.trim() }
        })
        .eq('id', messageId);

      if (error) throw error;

      toast({
        title: "Message traité",
        description: "Le message a été marqué comme traité avec succès"
      });

      setSelectedMessage(null);
      setResponse("");
      fetchMessages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de traiter le message"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'normal': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <MessageCircle className="h-4 w-4" />;
      case 'read': return <Clock className="h-4 w-4" />;
      case 'processed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length + mcardMessages.filter(m => !m.is_read).length;
  const highPriorityCount = messages.filter(m => m.priority === 'high' || m.priority === 'urgent').length;
  const mcardMessagesCount = mcardMessages.length;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <AdminNavigation />
      
      <div className="flex flex-col gap-6">
        {/* Header avec statistiques */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Messages Administration</h1>
            <p className="text-muted-foreground">
              Gérez les demandes de récupération et autres messages administratifs
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <div className="text-sm text-muted-foreground">Non lus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{highPriorityCount}</div>
              <div className="text-sm text-muted-foreground">Priorité haute</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mcardMessagesCount}</div>
              <div className="text-sm text-muted-foreground">Messages mCard</div>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro de carte, titre ou contenu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Messages mCard (Commandes) */}
        {filteredMcardMessages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Messages de commandes ({filteredMcardMessages.length})
            </h2>
            <div className="grid gap-4">
              {filteredMcardMessages.map((message) => (
                <Card key={message.id} className={`cursor-pointer transition-all hover:shadow-md ${
                  !message.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          <CardTitle className="text-lg">
                            {message.subject || 'Message'}
                          </CardTitle>
                          {!message.is_read && (
                            <Badge variant="default">Nouveau</Badge>
                          )}
                        </div>
                        <CardDescription>
                          De: {message.sender_name} • Pour: {message.mcard_name}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {new Date(message.created_at).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/50 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/messages`)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Répondre
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Messages administratifs */}
        {filteredMessages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Messages administratifs ({filteredMessages.length})
            </h2>
            <div className="grid gap-4">
              {filteredMessages.map((message) => (
            <Card key={message.id} className={`cursor-pointer transition-all hover:shadow-md ${
              message.status === 'unread' ? 'border-l-4 border-l-primary bg-blue-50/50' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(message.status)}
                      <CardTitle className="text-lg">{message.title}</CardTitle>
                      <Badge variant={getPriorityColor(message.priority)}>
                        {message.priority}
                      </Badge>
                    </div>
                    <CardDescription>{message.content}</CardDescription>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {new Date(message.created_at).toLocaleString('fr-FR')}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {message.card_info && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <strong>Numéro:</strong> {message.card_info.card_number}
                      </div>
                      <div>
                        <strong>Type:</strong> {message.card_info.document_type}
                      </div>
                      {message.card_info.recovery_final_price && (
                        <div>
                          <strong>Prix:</strong> {message.card_info.recovery_final_price} {message.card_info.recovery_currency_symbol}
                        </div>
                      )}
                      <div>
                        <strong>Lieu:</strong> {message.card_info.found_location}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {message.message_type === 'mcard_report' && message.card_info?.mcard_id && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewMCard(message.card_info.mcard_id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Voir la mCard
                      </Button>
                    )}
                    {message.message_type === 'recovery_request' && message.card_info?.card_number && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/recherche/${message.card_info.card_number}`)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Voir la carte signalée
                      </Button>
                    )}
                    {message.status === 'unread' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAsRead(message.id)}
                      >
                        Marquer comme lu
                      </Button>
                    )}
                    {message.status !== 'processed' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => setSelectedMessage(message)}
                      >
                        Traiter
                      </Button>
                    )}
                    {message.status === 'processed' && (
                      <Badge variant="outline" className="text-green-600">
                        Traité le {message.processed_at ? new Date(message.processed_at).toLocaleDateString('fr-FR') : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>
          </div>
        )}

        {filteredMessages.length === 0 && filteredMcardMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aucun message trouvé</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Aucun message ne correspond à votre recherche." : "Aucun message à traiter pour le moment."}
            </p>
          </div>
        )}
      </div>

      {/* Modal de traitement */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Traiter le message</CardTitle>
              <CardDescription>{selectedMessage.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">{selectedMessage.content}</p>
              </div>
              
              {selectedMessage.card_info && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Carte:</strong> {selectedMessage.card_info.card_number}</div>
                  <div><strong>Type:</strong> {selectedMessage.card_info.document_type}</div>
                  <div><strong>Lieu:</strong> {selectedMessage.card_info.found_location}</div>
                  {selectedMessage.card_info.recovery_final_price && (
                    <div><strong>Prix:</strong> {selectedMessage.card_info.recovery_final_price} {selectedMessage.card_info.recovery_currency_symbol}</div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Réponse/Action prise:</label>
                <Textarea
                  placeholder="Décrivez l'action prise ou la réponse donnée..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Annuler
                </Button>
                <Button 
                  onClick={() => processMessage(selectedMessage.id)}
                  disabled={processing || !response.trim()}
                >
                  {processing ? "Traitement..." : "Marquer comme traité"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};