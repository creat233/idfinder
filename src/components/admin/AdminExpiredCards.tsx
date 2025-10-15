import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Mail, Phone, Calendar, Search, Send, Clock } from "lucide-react";

interface ExpiredCard {
  id: string;
  user_id: string;
  full_name: string;
  plan: string;
  user_email: string;
  user_phone: string;
  subscription_expires_at: string;
  days_expired: number;
  created_at: string;
}

export const AdminExpiredCards = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [sendingNotifications, setSendingNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: expiredCards = [], isLoading } = useQuery({
    queryKey: ['admin-expired-cards'],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching expired cards...');
        const { data, error } = await supabase.rpc('admin_get_expired_mcards');
        
        console.log('📊 Response:', { data, error });
        
        if (error) {
          console.error('❌ Error fetching expired cards:', error);
          throw error;
        }
        
        console.log('✅ Expired cards loaded:', data?.length || 0, 'cards');
        console.log('📋 Cards data:', data);
        
        return data as ExpiredCard[];
      } catch (error) {
        console.error('❌ Exception in fetchExpiredCards:', error);
        throw error;
      }
    },
  });

  const handleSendNotifications = async () => {
    setSendingNotifications(true);
    try {
      const { data, error } = await supabase.rpc('admin_send_renewal_notifications');
      
      if (error) throw error;

      if (data && data[0]) {
        toast({
          title: "Notifications envoyées !",
          description: `${data[0].notifications_sent} notifications de renouvellement ont été envoyées avec succès.`,
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi des notifications:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer les notifications de renouvellement",
      });
    } finally {
      setSendingNotifications(false);
    }
  };

  // Filtrer les cartes selon la recherche
  const filteredCards = expiredCards.filter(card => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      card.full_name?.toLowerCase().includes(query) ||
      card.user_email?.toLowerCase().includes(query) ||
      card.plan?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Cartes expirées (30+ jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log('🎯 Current state:', { 
    isLoading, 
    cardsCount: expiredCards?.length,
    filteredCount: filteredCards?.length 
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Cartes expirées depuis plus de 30 jours ({expiredCards?.length || 0})
        </CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={handleSendNotifications}
            disabled={sendingNotifications || expiredCards.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {sendingNotifications ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Envoi en cours...
              </div>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer rappels de renouvellement
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="🔍 Rechercher par nom, email, plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-600">
              {filteredCards.length} résultat{filteredCards.length > 1 ? 's' : ''} trouvé{filteredCards.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {expiredCards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune carte expirée depuis plus de 30 jours</p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune carte ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCards.map((card) => (
              <div key={card.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{card.full_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {card.user_email}
                        </div>
                        {card.user_phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {card.user_phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2 border-orange-500 text-orange-700">
                      Plan {card.plan}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                      <Calendar className="h-3 w-3" />
                      Expiré depuis {card.days_expired} jours
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-3 rounded-lg mb-4 border border-red-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Date d'expiration:</span>
                      <p className="text-red-600">
                        {new Date(card.subscription_expires_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Carte créée le:</span>
                      <p>{new Date(card.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Optionnel: action spécifique pour cette carte
                      toast({
                        title: "Information",
                        description: `Carte de ${card.full_name} - Expirée depuis ${card.days_expired} jours`
                      });
                    }}
                  >
                    Voir détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};