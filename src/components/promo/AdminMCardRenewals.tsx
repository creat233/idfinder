
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, RefreshCw, User, Mail, Phone, Calendar, Search } from "lucide-react";

interface PendingRenewal {
  id: string;
  mcard_id: string;
  current_plan: string;
  requested_at: string;
  status: string;
  mcard_name: string;
  user_email: string;
  user_phone: string;
  subscription_expires_at: string;
  days_remaining: number;
}

export const AdminMCardRenewals = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingRenewals = [], isLoading } = useQuery({
    queryKey: ['admin-pending-renewals'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('admin_get_pending_renewals');
        if (error) throw error;
        return data as PendingRenewal[];
      } catch (error) {
        console.error('Erreur lors de la récupération des renouvellements:', error);
        return [];
      }
    },
  });

  const handleApproveRenewal = async (renewalId: string, mcardId: string) => {
    setLoading(renewalId);
    try {
      const { data, error } = await supabase.rpc('admin_approve_mcard_renewal', {
        p_renewal_id: renewalId,
        p_mcard_id: mcardId
      });

      if (error) throw error;

      if (data && data[0]?.success) {
        toast({
          title: "Renouvellement approuvé !",
          description: data[0].message,
        });
        queryClient.invalidateQueries({ queryKey: ['admin-pending-renewals'] });
      } else {
        throw new Error(data?.[0]?.message || "Erreur inconnue");
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'approbation:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'approuver le renouvellement",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleRejectRenewal = async (renewalId: string) => {
    setLoading(renewalId);
    try {
      // Utiliser un update direct sur la table
      const { error } = await supabase
        .from('mcard_renewal_requests' as any)
        .update({ status: 'rejected' })
        .eq('id', renewalId);

      if (error) throw error;

      toast({
        title: "Renouvellement rejeté",
        description: "La demande de renouvellement a été rejetée."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-pending-renewals'] });
    } catch (error: any) {
      console.error('Erreur lors du rejet:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rejeter le renouvellement"
      });
    } finally {
      setLoading(null);
    }
  };

  // Filtrer les renouvellements selon la recherche
  const filteredRenewals = pendingRenewals.filter(renewal => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      renewal.mcard_name?.toLowerCase().includes(query) ||
      renewal.user_email?.toLowerCase().includes(query) ||
      renewal.current_plan?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Demandes de renouvellement mCard
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
          <RefreshCw className="h-5 w-5" />
          Demandes de renouvellement mCard ({pendingRenewals.length})
        </CardTitle>
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
              {filteredRenewals.length} résultat{filteredRenewals.length > 1 ? 's' : ''} trouvé{filteredRenewals.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {pendingRenewals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune demande de renouvellement en attente</p>
          </div>
        ) : filteredRenewals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun renouvellement ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRenewals.map((renewal) => (
              <div key={renewal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{renewal.mcard_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {renewal.user_email}
                        </div>
                        {renewal.user_phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {renewal.user_phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2">
                      Plan {renewal.current_plan}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {renewal.days_remaining > 0 
                        ? `${renewal.days_remaining} jours restants`
                        : 'Expiré'
                      }
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Demandé le:</span>
                      <p>{new Date(renewal.requested_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <span className="font-medium">Expire le:</span>
                      <p className={renewal.days_remaining <= 0 ? 'text-red-600' : ''}>
                        {new Date(renewal.subscription_expires_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleRejectRenewal(renewal.id)}
                    disabled={loading === renewal.id}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                  <Button
                    onClick={() => handleApproveRenewal(renewal.id, renewal.mcard_id)}
                    disabled={loading === renewal.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading === renewal.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Traitement...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver le renouvellement
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
