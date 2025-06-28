
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useMCardRenewal = () => {
  const { toast } = useToast();

  const handleRenewalRequest = async (mcardId: string, currentPlan: string) => {
    try {
      const { error } = await supabase
        .from('mcard_renewal_requests')
        .insert([
          {
            mcard_id: mcardId,
            current_plan: currentPlan,
            requested_at: new Date().toISOString(),
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Demande de renouvellement envoyée !",
        description: "Votre demande de renouvellement a été envoyée à l'administration. Vous recevrez une confirmation une fois le paiement validé."
      });
    } catch (error) {
      console.error('Erreur lors de la demande de renouvellement:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la demande de renouvellement. Veuillez réessayer."
      });
    }
  };

  const getDaysRemaining = (subscriptionExpiresAt: string | null) => {
    if (!subscriptionExpiresAt) return 0;
    const now = new Date();
    const expiry = new Date(subscriptionExpiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return {
    handleRenewalRequest,
    getDaysRemaining
  };
};
