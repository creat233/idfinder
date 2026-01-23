import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Wallet, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Phone,
  MessageCircle,
  Calendar,
  ArrowRight,
  RefreshCw,
  Send
} from 'lucide-react';
import { MCard } from '@/types/mcard';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInDays, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface PendingPayment {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientPhone?: string;
  amount: number;
  dueDate?: string;
  createdAt: string;
  daysOverdue: number;
  status: 'pending' | 'overdue' | 'reminder_sent';
}

interface MCardPaymentTrackerProps {
  mcard: MCard;
  isOwner: boolean;
}

export const MCardPaymentTracker = ({ mcard, isOwner }: MCardPaymentTrackerProps) => {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOwner && mcard.id && isOpen) {
      loadPendingPayments();
    }
  }, [isOwner, mcard.id, isOpen]);

  const loadPendingPayments = async () => {
    try {
      setLoading(true);
      
      const { data: invoices } = await supabase
        .from('mcard_invoices')
        .select('id, invoice_number, client_name, client_phone, amount, due_date, created_at, status, is_validated')
        .eq('mcard_id', mcard.id)
        .eq('is_validated', false)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false });

      const pendingPayments: PendingPayment[] = (invoices || []).map(inv => {
        const dueDate = inv.due_date ? new Date(inv.due_date) : null;
        const now = new Date();
        const daysOverdue = dueDate ? differenceInDays(now, dueDate) : 0;
        const isOverdue = dueDate ? isPast(dueDate) : false;

        return {
          id: inv.id,
          invoiceNumber: inv.invoice_number,
          clientName: inv.client_name,
          clientPhone: inv.client_phone || undefined,
          amount: inv.amount,
          dueDate: inv.due_date || undefined,
          createdAt: inv.created_at,
          daysOverdue: isOverdue ? daysOverdue : 0,
          status: isOverdue ? 'overdue' : 'pending'
        };
      });

      setPayments(pendingPayments);
    } catch (error) {
      console.error('Error loading pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (payment: PendingPayment) => {
    // Ouvrir WhatsApp avec un message pré-rempli
    if (payment.clientPhone) {
      const message = encodeURIComponent(
        `Bonjour ${payment.clientName},\n\n` +
        `Nous vous rappelons que la facture ${payment.invoiceNumber} d'un montant de ${formatCurrency(payment.amount)} est en attente de paiement.\n\n` +
        `Merci de procéder au règlement dès que possible.\n\n` +
        `Cordialement,\n${mcard.full_name}`
      );
      
      const phone = payment.clientPhone.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
      
      toast({
        title: "Relance envoyée",
        description: `Message de relance envoyé à ${payment.clientName}`
      });
    } else {
      toast({
        title: "Numéro manquant",
        description: "Ce client n'a pas de numéro de téléphone enregistré",
        variant: "destructive"
      });
    }
  };

  const markAsPaid = async (paymentId: string) => {
    try {
      await supabase
        .from('mcard_invoices')
        .update({ is_validated: true, validated_at: new Date().toISOString() })
        .eq('id', paymentId);

      toast({
        title: "Paiement validé",
        description: "La facture a été marquée comme payée"
      });
      
      loadPendingPayments();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de valider le paiement",
        variant: "destructive"
      });
    }
  };

  if (!isOwner) return null;
  if (mcard.plan === 'free') return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const totalPending = payments.reduce((sum, p) => sum + p.amount, 0);
  const overduePayments = payments.filter(p => p.status === 'overdue');
  const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start relative">
          <Wallet className="h-4 w-4 mr-2" />
          Suivi des paiements
          {payments.length > 0 && (
            <Badge className="ml-auto bg-orange-500 text-white">
              {payments.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-600" />
            Suivi des Paiements
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card className="p-3 bg-orange-50 border-orange-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">En attente</span>
                  </div>
                  <p className="text-lg font-bold text-orange-700">{formatCurrency(totalPending)}</p>
                  <p className="text-xs text-orange-600">{payments.length} facture(s)</p>
                </Card>
                
                <Card className={`p-3 ${overduePayments.length > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className={`h-4 w-4 ${overduePayments.length > 0 ? 'text-red-600' : 'text-green-600'}`} />
                    <span className={`text-sm font-medium ${overduePayments.length > 0 ? 'text-red-800' : 'text-green-800'}`}>
                      En retard
                    </span>
                  </div>
                  <p className={`text-lg font-bold ${overduePayments.length > 0 ? 'text-red-700' : 'text-green-700'}`}>
                    {formatCurrency(totalOverdue)}
                  </p>
                  <p className={`text-xs ${overduePayments.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {overduePayments.length} facture(s)
                  </p>
                </Card>
              </div>

              {/* Actions groupées */}
              {overduePayments.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {overduePayments.length} facture(s) en retard nécessite(nt) une relance
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                    onClick={() => {
                      overduePayments.forEach(p => {
                        if (p.clientPhone) sendReminder(p);
                      });
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Relancer toutes les factures en retard
                  </Button>
                </div>
              )}

              {/* Liste des paiements */}
              <div className="flex-1 overflow-y-auto space-y-2">
                {payments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p className="font-medium text-green-700">Aucun paiement en attente !</p>
                    <p className="text-sm">Toutes vos factures sont réglées 🎉</p>
                  </div>
                ) : (
                  payments.map((payment) => (
                    <Card 
                      key={payment.id} 
                      className={`hover:shadow-md transition-shadow ${
                        payment.status === 'overdue' ? 'border-red-200 bg-red-50/30' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{payment.clientName}</h4>
                              {payment.status === 'overdue' && (
                                <Badge variant="destructive" className="text-xs">
                                  {payment.daysOverdue}j de retard
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Facture #{payment.invoiceNumber}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-orange-600">
                            {formatCurrency(payment.amount)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Créée: {format(new Date(payment.createdAt), 'dd MMM yyyy', { locale: fr })}
                          </span>
                          {payment.dueDate && (
                            <span className={`flex items-center gap-1 ${payment.status === 'overdue' ? 'text-red-600' : ''}`}>
                              <Clock className="h-3 w-3" />
                              Échéance: {format(new Date(payment.dueDate), 'dd MMM yyyy', { locale: fr })}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendReminder(payment)}
                            className="flex-1"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Relancer
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => markAsPaid(payment.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Payée
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Bouton refresh */}
              <Button 
                variant="outline" 
                onClick={loadPendingPayments} 
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
