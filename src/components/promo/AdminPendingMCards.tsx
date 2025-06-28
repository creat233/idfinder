
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
      const { data, error } = await supabase.rpc('admin_get_pending_mcards');
      if (error) throw error;
      return data as PendingMCard[];
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
          title: "Abonnement approuvé !",
          description: data[0].message,
        });
        queryClient.invalidateQueries({ queryKey: ['admin-pending-mcards'] });
        queryClient.invalidateQueries({ queryKey: ['admin-revenue-stats'] });
      } else {
        throw new Error(data?.[0]?.message || "Erreur inconnue");
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'approbation:', error);
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
