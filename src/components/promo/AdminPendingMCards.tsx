
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
  essential: { price: 15000, name: 'Essentiel' },
  premium: { price: 25000, name: 'Premium' }
};

export const AdminPendingMCards = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer toutes les mCards via une requête directe
  const { data: allMCards = [], isLoading } = useQuery({
    queryKey: ['admin-all-mcards'],
    queryFn: async () => {
      // D'abord récupérer les mCards avec les profils
      const { data: mcardsData, error: mcardsError } = await supabase
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
        .order('subscription_status', { ascending: true })
        .order('created_at', { ascending: true });

      if (mcardsError) throw mcardsError;

      // Récupérer les profils des utilisateurs
      const userIds = mcardsData.map(card => card.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, phone')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Récupérer les emails des utilisateurs via auth.admin
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Mapper toutes les données
      return mcardsData.map(card => {
        const profile = profilesData && profilesData.find(p => p && p.id === card.user_id);
        const authUser = authData && authData.users && authData.users.find(u => u && u.id === card.user_id);
        
        return {
          ...card,
          user_email: authUser?.email || 'Non disponible',
          user_phone: profile?.phone || 'Non renseigné'
        };
      }) as PendingMCard[];
    },
  });

  const handleApproveSubscription = async (mcardId: string) => {
    setLoading(mcardId);
    try {
      const { data, error } = await supabase.rpc('admin_approve_mcard_subscription', {
        p_mcard_id: mcardId
      });

      if (error) throw error;

      if (data && data[0]?.success) {
        toast({
          title: "Carte activée !",
          description: data[0].message,
        });
        queryClient.invalidateQueries({ queryKey: ['admin-all-mcards'] });
        queryClient.invalidateQueries({ queryKey: ['admin-revenue-stats'] });
      } else {
        throw new Error(data?.[0]?.message || "Erreur inconnue");
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'activation:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'activer la carte",
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

  // Calculer le nombre de cartes non-actives et les revenus potentiels
  const nonActiveCards = allMCards.filter(card => card.subscription_status !== 'active');
  const totalPotentialRevenue = nonActiveCards.reduce((total, mcard) => {
    const planInfo = PLAN_PRICES[mcard.plan as keyof typeof PLAN_PRICES];
    return total + (planInfo?.price || 0);
  }, 0);

  return (
    <Card>
      <AdminPendingMCardsHeader 
        pendingCount={nonActiveCards.length}
        totalPotentialRevenue={totalPotentialRevenue}
      />
      <CardContent>
        <AdminPendingMCardsTable
          pendingMCards={allMCards}
          loading={loading}
          onApprove={handleApproveSubscription}
          onPreview={handlePreviewCard}
        />
      </CardContent>
    </Card>
  );
};
