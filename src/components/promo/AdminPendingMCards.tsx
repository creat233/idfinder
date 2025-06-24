
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, CreditCard, User, Calendar, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface PendingMCard {
  id: string;
  user_id: string;
  full_name: string;
  plan: string;
  price: number;
  created_at: string;
  user_email: string;
  user_phone: string;
}

export const AdminPendingMCards = () => {
  const [pendingMCards, setPendingMCards] = useState<PendingMCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchPendingMCards = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_get_pending_mcards');
      
      if (error) {
        throw error;
      }

      setPendingMCards(data || []);
    } catch (error: any) {
      console.error('Error fetching pending mCards:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de charger les cartes en attente"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingMCards();
  }, []);

  const handleApprovePayment = async (mcardId: string) => {
    try {
      setProcessingIds(prev => new Set(prev).add(mcardId));
      
      const { data, error } = await supabase.rpc('admin_approve_mcard_subscription', {
        p_mcard_id: mcardId
      });

      if (error) {
        throw error;
      }

      if (data && data[0]?.success) {
        toast({
          title: "Paiement approuvé",
          description: "L'abonnement mCard a été activé avec succès"
        });
        
        // Actualiser la liste
        await fetchPendingMCards();
      } else {
        throw new Error(data?.[0]?.message || "Erreur lors de l'approbation");
      }
    } catch (error: any) {
      console.error('Error approving mCard payment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'approuver le paiement"
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(mcardId);
        return newSet;
      });
    }
  };

  const getPlanDisplay = (plan: string) => {
    switch (plan) {
      case 'essential':
        return 'Essentiel';
      case 'premium':
        return 'Premium';
      case 'free':
        return 'Gratuit';
      default:
        return plan;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'essential':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'free':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Cartes mCard en attente de paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Cartes mCard en attente de paiement
          <Badge variant="secondary">{pendingMCards.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingMCards.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Aucune carte en attente de paiement</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingMCards.map((mcard) => (
              <div key={mcard.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-semibold">{mcard.full_name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        {mcard.user_email}
                        {mcard.user_phone && (
                          <>
                            <span>•</span>
                            <span>{mcard.user_phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getPlanColor(mcard.plan)}>
                      {getPlanDisplay(mcard.plan)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {mcard.price} FCFA
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    Demandé {formatDistanceToNow(new Date(mcard.created_at), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprovePayment(mcard.id)}
                      disabled={processingIds.has(mcard.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {processingIds.has(mcard.id) ? "Traitement..." : "Approuver le paiement"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
