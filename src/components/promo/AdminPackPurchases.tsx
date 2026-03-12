import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Check, X, Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PackRequest {
  id: string;
  mcard_id: string;
  user_id: string;
  pack_size: number;
  price_fcfa: number;
  status: string;
  created_at: string;
  mcard_name?: string;
}

export const AdminPackPurchases = () => {
  const [requests, setRequests] = useState<PackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('mcard_pack_purchase_requests' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const rawData = (data || []) as any[];
      const enriched = await Promise.all(rawData.map(async (req: any) => {
        const { data: mcard } = await supabase
          .from('mcards')
          .select('full_name')
          .eq('id', req.mcard_id)
          .single();
        
        return {
          ...req,
          mcard_name: mcard?.full_name || 'Inconnu',
        } as PackRequest;
      }));

      setRequests(enriched);
    } catch (error) {
      console.error('Error fetching pack requests:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (request: PackRequest) => {
    setProcessing(request.id);
    try {
      const { error: packError } = await supabase
        .from('mcard_marketing_packs')
        .insert({
          mcard_id: request.mcard_id,
          pack_size: request.pack_size,
          price_fcfa: request.price_fcfa,
          messages_remaining: request.pack_size,
          purchased_at: new Date().toISOString()
        });

      if (packError) throw packError;

      const { error: updateError } = await supabase
        .from('mcard_pack_purchase_requests' as any)
        .update({ 
          status: 'approved', 
          processed_at: new Date().toISOString()
        } as any)
        .eq('id', request.id);

      if (updateError) throw updateError;

      toast({
        title: "✅ Pack activé !",
        description: `${request.pack_size} messages ajoutés pour ${request.mcard_name}`
      });

      fetchRequests();
    } catch (error) {
      console.error('Error approving pack:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'activer le pack"
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (request: PackRequest) => {
    setProcessing(request.id);
    try {
      const { error } = await supabase
        .from('mcard_pack_purchase_requests' as any)
        .update({ 
          status: 'rejected',
          processed_at: new Date().toISOString()
        } as any)
        .eq('id', request.id);

      if (error) throw error;

      toast({
        title: "Demande refusée",
        description: `La demande de ${request.mcard_name} a été refusée`
      });

      fetchRequests();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de refuser la demande"
      });
    } finally {
      setProcessing(null);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Achats de Packs Marketing
          {pendingRequests.length > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">{pendingRequests.length}</Badge>
          )}
        </h2>
        <Button variant="outline" size="sm" onClick={fetchRequests}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Actualiser
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : pendingRequests.length === 0 && processedRequests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune demande d'achat de pack
          </CardContent>
        </Card>
      ) : (
        <>
          {pendingRequests.length > 0 && (
            <Card className="border-orange-200 bg-orange-50/30">
              <CardHeader>
                <CardTitle className="text-lg text-orange-800">
                  ⏳ En attente ({pendingRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-background rounded-lg border shadow-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{req.mcard_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {req.pack_size} messages • {req.price_fcfa.toLocaleString()} FCFA
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(req.created_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(req)}
                        disabled={processing === req.id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {processing === req.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        Activer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(req)}
                        disabled={processing === req.id}
                        className="border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Refuser
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {processedRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {processedRequests.slice(0, 20).map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{req.mcard_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {req.pack_size} messages • {req.price_fcfa.toLocaleString()} FCFA
                      </p>
                    </div>
                    <Badge variant={req.status === 'approved' ? 'default' : 'destructive'}>
                      {req.status === 'approved' ? '✅ Activé' : '❌ Refusé'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
