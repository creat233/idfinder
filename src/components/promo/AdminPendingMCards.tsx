
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminPendingMCardsHeader } from "./admin-pending-mcards/AdminPendingMCardsHeader";
import { AdminPendingMCardsTable } from "./admin-pending-mcards/AdminPendingMCardsTable";
import { Search } from "lucide-react";
import { URL_CONFIG } from "@/utils/urlConfig";

interface PendingMCard {
  id: string;
  user_id: string;
  full_name: string;
  plan: string;
  created_at: string;
  user_email: string;
  user_phone: string;
  slug: string;
  subscription_status: string;
  subscription_expires_at?: string;
}

const PLAN_PRICES = {
  essential: { price: 2000, name: 'Essentiel' },
  premium: { price: 5000, name: 'Premium' }
};

export const AdminPendingMCards = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Écouter les changements en temps réel sur les tables mcards
  useEffect(() => {
    const channel = supabase
      .channel('admin-mcards-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mcards'
        },
        (payload) => {
          console.log('Changement détecté sur mcards:', payload);
          // Invalider et refrescher les données
          queryClient.invalidateQueries({ queryKey: ['admin-all-mcards'] });
          
          // Afficher une notification pour les nouvelles cartes
          if (payload.eventType === 'INSERT') {
            toast({
              title: "🆕 Nouvelle carte créée",
              description: `La carte "${payload.new.full_name}" vient d'être créée et nécessite une activation.`,
            });
          } else if (payload.eventType === 'UPDATE' && payload.old.subscription_status !== payload.new.subscription_status) {
            toast({
              title: "📝 Carte mise à jour",
              description: `Le statut de la carte "${payload.new.full_name}" a changé.`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  // Récupérer toutes les mCards avec gestion d'erreur améliorée
  const { data: allMCards = [], isLoading, error } = useQuery({
    queryKey: ['admin-all-mcards'],
    queryFn: async () => {
      console.log('Récupération des mCards via admin_get_all_mcards...');
      
      try {
        // Utiliser la fonction RPC pour récupérer toutes les mCards
        const { data, error } = await supabase.rpc('admin_get_all_mcards');

        if (error) {
          console.error('Erreur RPC admin_get_all_mcards:', error);
          throw error;
        }

        console.log('Données reçues:', data);
        return (data || []) as PendingMCard[];
      } catch (rpcError) {
        console.error('Erreur lors de l\'appel RPC, tentative avec requête directe:', rpcError);
        
        // Fallback: requête directe si RPC échoue
        const { data, error: directError } = await supabase
          .from('mcards')
          .select(`
            id,
            user_id,
            full_name,
            plan,
            created_at,
            slug,
            subscription_status,
            subscription_expires_at
          `)
          .order('created_at', { ascending: false });

        if (directError) {
          console.error('Erreur requête directe:', directError);
          throw directError;
        }

        return (data || []) as PendingMCard[];
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  const handleApproveSubscription = async (mcardId: string) => {
    setLoading(mcardId);
    try {
      console.log('Activation de la mCard:', mcardId);
      
      const { data, error } = await supabase.rpc('admin_approve_mcard_subscription', {
        p_mcard_id: mcardId
      });

      if (error) {
        console.error('Erreur lors de l\'activation:', error);
        throw error;
      }

      console.log('Réponse d\'activation:', data);

      if (data && data[0]?.success) {
        toast({
          title: "Carte activée !",
          description: data[0].message,
        });
        queryClient.invalidateQueries({ queryKey: ['admin-all-mcards'] });
        queryClient.invalidateQueries({ queryKey: ['admin-revenue-stats'] });
      } else {
        throw new Error(data?.[0]?.message || "Erreur inconnue lors de l'activation");
      }
    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'activation",
        description: error.message || "Impossible d'activer la carte. Vérifiez les logs pour plus de détails.",
      });
    } finally {
      setLoading(null);
    }
  };

  const handlePreviewCard = (slug: string) => {
    // Ouvrir la carte dans un nouvel onglet
    const url = URL_CONFIG.getMCardUrl(slug);
    console.log('Ouverture de la carte:', url);
    window.open(url, '_blank');
  };

  // Gestion des erreurs de chargement
  if (error) {
    console.error('Erreur de chargement des mCards:', error);
    return (
      <Card>
        <AdminPendingMCardsHeader pendingCount={0} totalPotentialRevenue={0} />
        <CardContent>
          <div className="text-center p-8">
            <div className="text-red-600 mb-4">
              ⚠️ Erreur de chargement des cartes
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Impossible de charger la liste des cartes. Cela peut être dû à un problème de permissions ou de connexion.
            </p>
            <details className="text-left text-xs text-gray-500 bg-gray-50 p-4 rounded">
              <summary className="cursor-pointer font-medium">Détails de l'erreur</summary>
              <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
            </details>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <AdminPendingMCardsHeader pendingCount={0} totalPotentialRevenue={0} />
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600">Chargement des cartes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filtrer les cartes selon la recherche
  const filteredMCards = allMCards.filter(card => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      card.full_name?.toLowerCase().includes(query) ||
      card.user_email?.toLowerCase().includes(query) ||
      card.plan?.toLowerCase().includes(query) ||
      card.subscription_status?.toLowerCase().includes(query)
    );
  });

  // Calculer les statistiques
  const nonActiveCards = filteredMCards.filter(card => card.subscription_status !== 'active');
  const verifiedCards = filteredMCards.filter(card => card.subscription_status === 'active');
  const totalPotentialRevenue = nonActiveCards.reduce((total, mcard) => {
    const planInfo = PLAN_PRICES[mcard.plan as keyof typeof PLAN_PRICES];
    return total + (planInfo?.price || 0);
  }, 0);

  console.log('Statistiques des cartes:');
  console.log('- Total des cartes:', allMCards.length);
  console.log('- Cartes non-actives:', nonActiveCards.length);
  console.log('- Revenus potentiels:', totalPotentialRevenue);

  return (
    <div className="space-y-6">
      {/* Section des cartes vérifiées */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-green-600">📋 Comptes Vérifiés</h3>
              <p className="text-sm text-gray-600">Cartes actives et vérifiées</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{verifiedCards.length}</div>
              <div className="text-sm text-gray-500">Comptes vérifiés</div>
            </div>
          </div>
          
          {verifiedCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verifiedCards.slice(0, 6).map((card) => (
                <div key={card.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-800">{card.full_name}</h4>
                      <p className="text-sm text-green-600">{card.user_email}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        {PLAN_PRICES[card.plan as keyof typeof PLAN_PRICES]?.name || card.plan}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePreviewCard(card.slug)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Voir →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section principale avec recherche */}
      <Card>
        <AdminPendingMCardsHeader 
          pendingCount={nonActiveCards.length}
          totalPotentialRevenue={totalPotentialRevenue}
        />
        <CardContent>
          {/* Barre de recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="🔍 Rechercher par nom, email, plan, statut..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-600">
                {filteredMCards.length} résultat{filteredMCards.length > 1 ? 's' : ''} trouvé{filteredMCards.length > 1 ? 's' : ''}
              </div>
            )}
          </div>

          {allMCards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune carte trouvée dans la base de données.</p>
            </div>
          ) : filteredMCards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune carte ne correspond à votre recherche.</p>
            </div>
          ) : (
            <AdminPendingMCardsTable
              pendingMCards={filteredMCards}
              loading={loading}
              onApprove={handleApproveSubscription}
              onPreview={handlePreviewCard}
              onRefresh={() => queryClient.invalidateQueries({ queryKey: ['admin-all-mcards'] })}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
