import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, X, Eye, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VerificationRequest {
  id: string;
  mcard_id: string;
  user_id: string;
  id_document_url: string;
  ninea_document_url?: string;
  payment_status: string;
  verification_fee: number;
  status: string;
  created_at: string;
  // Données jointes
  mcard_name?: string;
  user_email?: string;
  user_phone?: string;
}

export const AdminMCardVerifications = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadVerificationRequests();
  }, []);

  const loadVerificationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('mcard_verification_requests')
        .select(`
          *,
          mcards!inner(full_name, user_id),
          profiles!inner(phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Récupérer les emails des utilisateurs
      const userIds = data?.map((req: any) => req.mcards.user_id) || [];
      
      const processedData = data?.map((req: any) => ({
        ...req,
        mcard_name: req.mcards.full_name,
        user_email: req.user_id, // Temporary fallback
        user_phone: req.profiles?.phone
      })) || [];

      setRequests(processedData);
    } catch (error: any) {
      console.error('Erreur lors du chargement:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les demandes de vérification"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVerification = async (requestId: string) => {
    setProcessing(requestId);
    try {
      const { data, error } = await supabase.rpc('admin_approve_mcard_verification', {
        p_request_id: requestId
      });

      if (error) throw error;

      const result = data?.[0];
      if (result?.success) {
        toast({
          title: "✅ Vérification approuvée",
          description: result.message
        });
        loadVerificationRequests();
      } else {
        throw new Error(result?.message || 'Erreur inconnue');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectVerification = async (requestId: string) => {
    setProcessing(requestId);
    try {
      const { error } = await supabase
        .from('mcard_verification_requests')
        .update({ 
          status: 'rejected',
          processed_by: (await supabase.auth.getUser()).data.user?.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "❌ Demande rejetée",
        description: "La demande de vérification a été rejetée"
      });
      loadVerificationRequests();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleViewDocument = async (documentUrl: string) => {
    try {
      const { data } = await supabase.storage
        .from('verification-documents')
        .createSignedUrl(documentUrl, 3600);
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ouvrir le document"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demandes de Vérification MCard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  const pendingRequests = requests.filter(req => req.status === 'pending');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          Demandes de Vérification MCard ({pendingRequests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune demande de vérification en attente
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{request.mcard_name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Email:</strong> {request.user_email}</p>
                      <p><strong>Téléphone:</strong> {request.user_phone || 'Non renseigné'}</p>
                      <p><strong>Frais:</strong> {request.verification_fee.toLocaleString()} FCFA</p>
                      <p><strong>Demandé le:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={request.payment_status === 'paid' ? 'default' : 'secondary'}
                    >
                      {request.payment_status === 'paid' ? 'Payé' : 'En attente de paiement'}
                    </Badge>
                    <Badge variant="outline">
                      {request.status === 'pending' ? 'En attente' : request.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Documents:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDocument(request.id_document_url)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Pièce d'identité
                    </Button>
                    {request.ninea_document_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDocument(request.ninea_document_url!)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Document NINEA
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    onClick={() => handleApproveVerification(request.id)}
                    disabled={processing === request.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {processing === request.id ? 'Traitement...' : 'Approuver'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRejectVerification(request.id)}
                    disabled={processing === request.id}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rejeter
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