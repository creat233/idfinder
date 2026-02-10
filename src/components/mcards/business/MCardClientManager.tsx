import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  MessageCircle,
  FileText,
  Star,
  MoreVertical,
  Eye,
  Wallet
} from 'lucide-react';
import { MCard } from '@/types/mcard';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RobustAvatar } from '@/components/ui/robust-avatar';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalPurchases: number;
  lastContact: string;
  status: 'active' | 'inactive' | 'prospect';
  notes?: string;
}

interface MCardClientManagerProps {
  mcard: MCard;
  isOwner: boolean;
}

export const MCardClientManager = ({ mcard, isOwner }: MCardClientManagerProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOwner && mcard.id) {
      loadClients();
    }
  }, [isOwner, mcard.id]);

  const loadClients = async () => {
    try {
      setLoading(true);
      
      // Charger les clients depuis les factures
      const { data: invoices } = await supabase
        .from('mcard_invoices')
        .select('client_name, client_email, client_phone, amount, created_at, is_validated')
        .eq('mcard_id', mcard.id)
        .order('created_at', { ascending: false });

      // Charger les messages pour avoir les contacts
      const { data: messages } = await supabase
        .from('mcard_messages')
        .select('sender_id, created_at, message')
        .eq('mcard_id', mcard.id)
        .order('created_at', { ascending: false });

      // Grouper les clients par nom
      const clientMap = new Map<string, Client>();

      invoices?.forEach(inv => {
        const key = inv.client_name?.toLowerCase() || 'unknown';
        const existing = clientMap.get(key);
        
        if (existing) {
          existing.totalPurchases += inv.amount || 0;
          if (new Date(inv.created_at) > new Date(existing.lastContact)) {
            existing.lastContact = inv.created_at;
          }
        } else {
          clientMap.set(key, {
            id: key,
            name: inv.client_name || 'Client inconnu',
            email: inv.client_email || undefined,
            phone: inv.client_phone || undefined,
            totalPurchases: inv.amount || 0,
            lastContact: inv.created_at,
            status: inv.is_validated ? 'active' : 'prospect'
          });
        }
      });

      setClients(Array.from(clientMap.values()));
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) return null;
  if (mcard.plan === 'free') return null;

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone?.includes(searchQuery)
  );

  const getStatusBadge = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Inactif</Badge>;
      case 'prospect':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Prospect</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Users className="h-4 w-4 mr-2" />
          Gérer mes clients ({clients.length})
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Gestionnaire de Clients (Mini-CRM)
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search & Actions */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
              <p className="text-lg font-bold text-green-700">{clients.filter(c => c.status === 'active').length}</p>
              <p className="text-xs text-green-600">Clients actifs</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
              <p className="text-lg font-bold text-blue-700">{clients.filter(c => c.status === 'prospect').length}</p>
              <p className="text-xs text-blue-600">Prospects</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
              <p className="text-lg font-bold text-purple-700">
                {formatCurrency(clients.reduce((sum, c) => sum + c.totalPurchases, 0))}
              </p>
              <p className="text-xs text-purple-600">Total achats</p>
            </div>
          </div>

          {/* Client List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun client trouvé</p>
                <p className="text-sm">Les clients seront ajoutés automatiquement depuis vos factures</p>
              </div>
            ) : (
              filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <RobustAvatar
                        src=""
                        alt={client.name}
                        fallbackText={client.name}
                        className="w-12 h-12"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold truncate">{client.name}</h4>
                          {getStatusBadge(client.status)}
                        </div>
                        
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                          {client.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {client.email}
                            </span>
                          )}
                          {client.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {client.phone}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1 text-green-600">
                              <Wallet className="h-3 w-3" />
                              {formatCurrency(client.totalPurchases)}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(client.lastContact), 'dd MMM yyyy', { locale: fr })}
                            </span>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" size="sm" className="h-8 w-8 p-0"
                              onClick={() => client.phone && window.open(`tel:${client.phone}`, '_self')}
                              disabled={!client.phone}
                              title={client.phone ? `Appeler ${client.phone}` : 'Pas de téléphone'}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" size="sm" className="h-8 w-8 p-0"
                              onClick={() => {
                                if (client.phone) {
                                  window.open(`https://wa.me/${client.phone.replace(/\s/g, '')}`, '_blank');
                                } else if (client.email) {
                                  window.open(`mailto:${client.email}`, '_blank');
                                }
                              }}
                              disabled={!client.phone && !client.email}
                              title="Envoyer un message"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" size="sm" className="h-8 w-8 p-0"
                              onClick={async () => {
                                const { data: invoices } = await supabase
                                  .from('mcard_invoices')
                                  .select('id')
                                  .eq('mcard_id', mcard.id)
                                  .ilike('client_name', client.name)
                                  .order('created_at', { ascending: false })
                                  .limit(1);
                                if (invoices?.[0]) {
                                  window.open(`/mcard/${mcard.slug}?invoice=${invoices[0].id}`, '_blank');
                                }
                              }}
                              title="Voir les factures"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
