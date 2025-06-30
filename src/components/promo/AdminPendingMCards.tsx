
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

  // Utiliser la fonction admin_get_all_mcards pour récupérer toutes les mCards
  const { data: allMCards = [], isLoading } = useQuery({
    queryKey: ['admin-all-mcards'],
    queryFn: async () => {
      console.log('Appel de admin_get_all_mcards...');
      // Use type assertion to work around temporary type mismatch
      const { data, error } = await (supabase.rpc as any)('admin_get_all_mcards');

      if (error) {
        console.error('Erreur admin_get_all_mcards:', error);
        throw error;
      }

      console.log('Données reçues de admin_get_all_mcards:', data);
      return (data || []) as PendingMCard[];
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

  console.log('Cartes non-actives:', nonActiveCards);
  console.log('Toutes les cartes:', allMCards);

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
