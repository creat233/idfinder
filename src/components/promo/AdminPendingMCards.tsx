
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminPendingMCardsHeader } from "./admin-pending-mcards/AdminPendingMCardsHeader";
import { AdminPendingMCardsTable } from "./admin-pending-mcards/AdminPendingMCardsTable";

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
  premium: { price: 3900, name: 'Premium' }
};

export const AdminPendingMCards = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    const url = `${window.location.origin}/m/${slug}`;
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

  // Calculer les statistiques
  const nonActiveCards = allMCards.filter(card => card.subscription_status !== 'active');
  const totalPotentialRevenue = nonActiveCards.reduce((total, mcard) => {
    const planInfo = PLAN_PRICES[mcard.plan as keyof typeof PLAN_PRICES];
    return total + (planInfo?.price || 0);
  }, 0);

  console.log('Statistiques des cartes:');
  console.log('- Total des cartes:', allMCards.length);
  console.log('- Cartes non-actives:', nonActiveCards.length);
  console.log('- Revenus potentiels:', totalPotentialRevenue);

  return (
    <Card>
      <AdminPendingMCardsHeader 
        pendingCount={nonActiveCards.length}
        totalPotentialRevenue={totalPotentialRevenue}
      />
      <CardContent>
        {allMCards.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune carte trouvée dans la base de données.</p>
          </div>
        ) : (
          <AdminPendingMCardsTable
            pendingMCards={allMCards}
            loading={loading}
            onApprove={handleApproveSubscription}
            onPreview={handlePreviewCard}
          />
        )}
      </CardContent>
    </Card>
  );
};
