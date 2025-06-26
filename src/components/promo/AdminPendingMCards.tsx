
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, CreditCard, User, Mail, Phone } from "lucide-react";

interface PendingMCard {
  id: string;
  user_id: string;
  full_name: string;
  plan: string;
  created_at: string;
  user_email: string;
  user_phone: string;
}

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            mCards en attente de validation
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          mCards en attente de validation ({pendingMCards.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingMCards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune mCard en attente de validation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingMCards.map((mcard) => (
              <div key={mcard.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{mcard.full_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {mcard.user_email}
                        </div>
                        {mcard.user_phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {mcard.user_phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      Plan {mcard.plan}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      Créée le {new Date(mcard.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => handleApproveSubscription(mcard.id)}
                    disabled={loading === mcard.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading === mcard.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Activation...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver l'abonnement
                      </>
                    )}
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
