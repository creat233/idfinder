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
}

const PLAN_PRICES = {
  essential: { price: 15000, name: 'Essentiel' },
  premium: { price: 25000, name: 'Premium' }
};

export const AdminPendingMCards = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingMCards = [], isLoading } = useQuery({
    queryKey: ['admin-pending-mcards'],
    queryFn: async () => {
      console.log('🔍 Récupération des mCards en attente...');
      
      // Récupérer directement depuis la table mcards avec les critères
      const { data, error } = await supabase
        .from('mcards')
        .select(`
          id,
          user_id,
          full_name,
          plan,
          created_at,
          slug,
          subscription_status
        `)
        .eq('subscription_status', 'trial')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors de la récupération:', error);
        throw error;
      }

      console.log('✅ mCards trouvées:', data);

      // Récupérer les emails des utilisateurs de façon sécurisée
      const userIds = data?.map(card => card.user_id) || [];
      const userEmails: Record<string, string> = {};
      const userPhones: Record<string, string> = {};
      
      if (userIds.length > 0) {
        try {
          // Récupérer les emails via l'API auth admin
          const { data: authData } = await supabase.auth.admin.listUsers();
          if (authData?.users) {
            authData.users.forEach((user: any) => {
              if (user.email) {
                userEmails[user.id] = user.email;
              }
            });
          }

          // Récupérer les téléphones depuis la table profiles
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, phone')
            .in('id', userIds);

          if (profilesData) {
            profilesData.forEach(profile => {
              if (profile.phone) {
                userPhones[profile.id] = profile.phone;
              }
            });
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      }

      // Transformer les données
      const transformedData = data?.map(card => ({
        id: card.id,
        user_id: card.user_id,
        full_name: card.full_name,
        plan: card.plan,
        created_at: card.created_at,
        slug: card.slug,
        user_email: userEmails[card.user_id] || 'Email non disponible',
        user_phone: userPhones[card.user_id] || 'Téléphone non disponible'
      })) || [];

      console.log('🔄 Données transformées:', transformedData);
      return transformedData as PendingMCard[];
    },
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });

  const handleApproveSubscription = async (mcardId: string) => {
    setLoading(mcardId);
    try {
      console.log('🔄 Approbation de la mCard:', mcardId);
      
      const { data, error } = await supabase.rpc('admin_approve_mcard_subscription', {
        p_mcard_id: mcardId
      });

      if (error) throw error;

      if (data && data[0]?.success) {
        toast({
          title: "mCard approuvée !",
          description: data[0].message,
        });
        queryClient.invalidateQueries({ queryKey: ['admin-pending-mcards'] });
        queryClient.invalidateQueries({ queryKey: ['admin-revenue-stats'] });
        console.log('✅ mCard approuvée avec succès');
      } else {
        throw new Error(data?.[0]?.message || "Erreur inconnue");
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'approbation:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'approuver l'abonnement",
      });
    } finally {
      setLoading(null);
    }
  };

  const handlePreviewCard = (slug: string) => {
    window.open(`/mcard/${slug}`, '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <AdminPendingMCardsHeader pendingCount={0} totalPotentialRevenue={0} />
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculer le total des revenus potentiels
  const totalPotentialRevenue = pendingMCards.reduce((total, mcard) => {
    const planInfo = PLAN_PRICES[mcard.plan as keyof typeof PLAN_PRICES];
    return total + (planInfo?.price || 0);
  }, 0);

  console.log('📊 Affichage final:', {
    pendingCount: pendingMCards.length,
    totalPotentialRevenue,
    cards: pendingMCards
  });

  return (
    <Card>
      <AdminPendingMCardsHeader 
        pendingCount={pendingMCards.length}
        totalPotentialRevenue={totalPotentialRevenue}
      />
      <CardContent>
        <AdminPendingMCardsTable
          pendingMCards={pendingMCards}
          loading={loading}
          onApprove={handleApproveSubscription}
          onPreview={handlePreviewCard}
        />
      </CardContent>
    </Card>
  );
};
