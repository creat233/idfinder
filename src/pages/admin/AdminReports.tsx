import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, Eye, Trash2, CheckCircle, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Report {
  id: string;
  mcard_id: string;
  reporter_id: string | null;
  reporter_email: string | null;
  report_reason: string;
  report_description: string | null;
  status: string;
  created_at: string;
  mcards: {
    full_name: string;
    profile_picture_url: string | null;
    slug: string;
    company: string | null;
    job_title: string | null;
  } | null;
}

const AdminReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'delete' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('mcard_reports')
        .select(`
          *,
          mcards (
            full_name,
            profile_picture_url,
            slug,
            company,
            job_title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports((data as any) || []);
    } catch (error) {
      console.error('Erreur lors du chargement des signalements:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les signalements"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedReport || !actionType) return;

    try {
      if (actionType === 'delete') {
        // Supprimer la carte signalée
        const { error: deleteError } = await supabase
          .from('mcards')
          .delete()
          .eq('id', selectedReport.mcard_id);

        if (deleteError) throw deleteError;

        // Marquer le signalement comme traité
        const { error: updateError } = await supabase
          .from('mcard_reports')
          .update({
            status: 'resolved',
            processed_by: (await supabase.auth.getUser()).data.user?.id,
            processed_at: new Date().toISOString()
          })
          .eq('id', selectedReport.id);

        if (updateError) throw updateError;

        toast({
          title: "Carte supprimée",
          description: "La carte signalée a été supprimée avec succès"
        });
      } else {
        // Marquer comme résolu sans supprimer
        const { error } = await supabase
          .from('mcard_reports')
          .update({
            status: 'resolved',
            processed_by: (await supabase.auth.getUser()).data.user?.id,
            processed_at: new Date().toISOString()
          })
          .eq('id', selectedReport.id);

        if (error) throw error;

        toast({
          title: "Signalement résolu",
          description: "Le signalement a été marqué comme résolu"
        });
      }

      loadReports();
      setSelectedReport(null);
      setActionType(null);
    } catch (error) {
      console.error('Erreur lors du traitement:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de traiter le signalement"
      });
    }
  };

  const getReasonLabel = (reason: string) => {
    const reasons: Record<string, string> = {
      spam: 'Spam ou contenu indésirable',
      inappropriate: 'Contenu inapproprié',
      fake: 'Faux profil ou informations frauduleuses',
      copyright: 'Violation de droits d\'auteur',
      harassment: 'Harcèlement ou intimidation',
      other: 'Autre'
    };
    return reasons[reason] || reason;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Résolu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status === 'resolved');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Chargement des signalements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            Gestion des Signalements
          </h1>
          <p className="text-gray-600">
            Gérez les signalements de cartes inappropriées soumis par les utilisateurs
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total signalements</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingReports.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Résolus</p>
                  <p className="text-2xl font-bold text-green-600">{resolvedReports.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Signalements en attente */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Signalements en attente ({pendingReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingReports.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucun signalement en attente</p>
            ) : (
              <div className="space-y-4">
                {pendingReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={report.mcards?.profile_picture_url || undefined} />
                          <AvatarFallback>
                            <User className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{report.mcards?.full_name}</h3>
                            {getStatusBadge(report.status)}
                          </div>
                          
                          {report.mcards?.job_title && (
                            <p className="text-sm text-gray-600 mb-1">{report.mcards.job_title}</p>
                          )}
                          
                          {report.mcards?.company && (
                            <p className="text-sm text-gray-600 mb-2">{report.mcards.company}</p>
                          )}
                          
                          <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                            <p className="font-medium text-red-800 text-sm">
                              Motif: {getReasonLabel(report.report_reason)}
                            </p>
                            {report.report_description && (
                              <p className="text-red-700 text-sm mt-1">
                                {report.report_description}
                              </p>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500">
                            Signalé le {new Date(report.created_at).toLocaleDateString('fr-FR')} à {new Date(report.created_at).toLocaleTimeString('fr-FR')}
                            {report.reporter_email && ` par ${report.reporter_email}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/mcard/${report.mcards?.slug}`, '_blank')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report);
                            setActionType('approve');
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Résoudre
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report);
                            setActionType('delete');
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signalements résolus */}
        {resolvedReports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Signalements résolus ({resolvedReports.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resolvedReports.slice(0, 10).map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{report.mcards?.full_name || 'Carte supprimée'}</p>
                        <p className="text-sm text-gray-600">
                          Motif: {getReasonLabel(report.report_reason)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Résolu le {new Date(report.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de confirmation */}
      <AlertDialog open={!!selectedReport && !!actionType} onOpenChange={() => { setSelectedReport(null); setActionType(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'delete' ? 'Supprimer la carte' : 'Résoudre le signalement'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'delete' 
                ? 'Êtes-vous sûr de vouloir supprimer définitivement cette carte ? Cette action est irréversible.'
                : 'Marquer ce signalement comme résolu sans supprimer la carte ?'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={actionType === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {actionType === 'delete' ? 'Supprimer' : 'Résoudre'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminReports;