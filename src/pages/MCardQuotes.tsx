import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Eye, Trash2, ArrowLeft } from 'lucide-react';
import { useQuotes } from '@/hooks/useQuotes';
import { MCardQuoteDialog } from '@/components/mcards/view/MCardQuoteDialog';
import { StyledQuoteView } from '@/components/mcards/quotes/StyledQuoteView';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Quote } from '@/types/quote';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const MCardQuotes = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mcard, setMcard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

  const { quotes, loading: quotesLoading, addQuote, deleteQuote } = useQuotes(mcard?.id || '');

  useEffect(() => {
    const fetchMCard = async () => {
      if (!slug || !user) return;

      try {
        const { data, error } = await supabase
          .from('mcards')
          .select('*')
          .eq('slug', slug)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        if (!data) {
          navigate('/mes-cartes');
          return;
        }

        setMcard(data);
      } catch (error) {
        console.error('Error fetching mcard:', error);
        navigate('/mes-cartes');
      } finally {
        setLoading(false);
      }
    };

    fetchMCard();
  }, [slug, user, navigate]);

  const handlePreview = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsPreviewDialogOpen(true);
  };

  const handleDelete = async (quoteId: string) => {
    await deleteQuote(quoteId);
    setQuoteToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'sent':
        return 'Envoyé';
      case 'accepted':
        return 'Accepté';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!mcard) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/mcard/${slug}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la carte
            </Button>
          </div>

          {/* Main Card */}
          <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Gestion des devis</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {mcard.full_name} - {mcard.company || 'Entreprise'}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="w-4 h-4" />
                  Créer un devis
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {quotesLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  Chargement des devis...
                </div>
              ) : quotes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Aucun devis pour le moment</h3>
                  <p className="text-muted-foreground mb-6">
                    Commencez par créer votre premier devis professionnel
                  </p>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Créer mon premier devis
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between p-5 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg">{quote.quote_number}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                            {getStatusLabel(quote.status)}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="font-medium">Client:</span>
                            <span>{quote.client_name}</span>
                          </p>
                          {quote.client_email && (
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="font-medium">Email:</span>
                              <span>{quote.client_email}</span>
                            </p>
                          )}
                          <div className="flex items-center gap-6 mt-3">
                            <span className="font-semibold text-lg text-blue-600">
                              {quote.amount.toLocaleString()} {quote.currency}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Créé le {format(new Date(quote.created_at), 'dd MMM yyyy', { locale: fr })}
                            </span>
                            {quote.valid_until && (
                              <span className="text-sm text-muted-foreground">
                                Valide jusqu'au {format(new Date(quote.valid_until), 'dd MMM yyyy', { locale: fr })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(quote)}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Aperçu
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuoteToDelete(quote.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <MCardQuoteDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={addQuote}
        mcardId={mcard.id}
      />

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedQuote && (
            <StyledQuoteView 
              quote={selectedQuote} 
              mcard={mcard}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!quoteToDelete} onOpenChange={() => setQuoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le devis</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => quoteToDelete && handleDelete(quoteToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MCardQuotes;
