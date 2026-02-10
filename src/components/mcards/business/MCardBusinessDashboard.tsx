import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  TrendingUp, Target, Wallet, Calendar, ArrowUp, ArrowDown,
  DollarSign, ShoppingBag, MessageCircle, Star, BarChart3,
  Clock, CheckCircle, AlertCircle, Users, Receipt
} from 'lucide-react';
import { MCard } from '@/types/mcard';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BusinessNotificationBadge } from '@/components/notifications/BusinessNotificationBadge';
import { MCardMarketingCampaigns } from './MCardMarketingCampaigns';
import { MCardLoyaltyProgram } from './MCardLoyaltyProgram';
import { MCardClientManager } from './MCardClientManager';
import { MCardExpenseTracker } from './MCardExpenseTracker';
import { MCardAdvancedDashboard } from './MCardAdvancedDashboard';
import { MCardStockManager } from './MCardStockManager';
import { MCardPdfReport } from './MCardPdfReport';
import { InvoiceCreateForm } from '@/components/mcards/invoices/InvoiceCreateForm';
import { MCardViewAddProductDialog } from '@/components/mcards/view/MCardViewAddProductDialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface BusinessStats {
  totalRevenue: number;
  pendingPayments: number;
  clientsCount: number;
  messagesCount: number;
  conversionRate: number;
  monthlyGoal: number;
  currentProgress: number;
}

interface MCardBusinessDashboardProps {
  mcard: MCard;
  isOwner: boolean;
}

export const MCardBusinessDashboard = ({ mcard, isOwner }: MCardBusinessDashboardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState<BusinessStats>({
    totalRevenue: 0, pendingPayments: 0, clientsCount: 0, messagesCount: 0,
    conversionRate: 0, monthlyGoal: 500000, currentProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);

  useEffect(() => {
    if (isOwner && mcard.id) loadBusinessStats();
  }, [isOwner, mcard.id]);

  const loadBusinessStats = async () => {
    try {
      setLoading(true);
      const [{ data: invoices }, { data: messages }] = await Promise.all([
        supabase.from('mcard_invoices').select('amount, status, is_validated, currency').eq('mcard_id', mcard.id),
        supabase.from('mcard_messages').select('id').eq('mcard_id', mcard.id)
      ]);

      const totalRevenue = invoices?.filter(inv => inv.is_validated)?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
      const pendingPayments = invoices?.filter(inv => !inv.is_validated && inv.status !== 'cancelled')?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
      const uniqueClients = new Set(invoices?.map(inv => inv.status) || []);
      const monthlyGoal = 500000;
      const currentProgress = (totalRevenue / monthlyGoal) * 100;
      const conversionRate = mcard.view_count > 0 ? ((invoices?.length || 0) / mcard.view_count) * 100 : 0;

      setStats({ totalRevenue, pendingPayments, clientsCount: uniqueClients.size, messagesCount: messages?.length || 0,
        conversionRate: Math.round(conversionRate * 100) / 100, monthlyGoal, currentProgress: Math.min(currentProgress, 100) });
    } catch (error) {
      console.error('Error loading business stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner || mcard.plan === 'free') return null;

  const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';

  const handleInvoiceSubmit = async (invoiceData: any) => {
    try {
      const invoiceNumber = `INV-${Date.now()}`;
      const totalAmount = invoiceData.items.reduce((sum: number, item: any) => sum + item.quantity * item.unit_price, 0);
      const { data: invoice, error } = await supabase.from('mcard_invoices').insert({
        mcard_id: mcard.id, invoice_number: invoiceNumber, client_name: invoiceData.client_name,
        client_email: invoiceData.client_email || null, client_phone: invoiceData.client_phone || null,
        amount: totalAmount, currency: invoiceData.currency, due_date: invoiceData.due_date || null,
        description: invoiceData.description || null, notes: invoiceData.notes || null, status: 'draft'
      }).select().single();
      if (error) throw error;
      if (invoice && invoiceData.items.length > 0) {
        const items = invoiceData.items.map((item: any) => ({
          invoice_id: invoice.id, description: item.description, quantity: item.quantity,
          unit_price: item.unit_price, total_price: item.quantity * item.unit_price
        }));
        await supabase.from('mcard_invoice_items').insert(items);
      }
      toast({ title: "Facture créée", description: `La facture ${invoiceNumber} a été créée.` });
      setIsInvoiceDialogOpen(false);
      loadBusinessStats();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de créer la facture.", variant: "destructive" });
    }
  };

  const kpis = [
    { label: 'Chiffre d\'affaires', value: formatCurrency(stats.totalRevenue), icon: Wallet, color: 'text-green-600', bgColor: 'bg-green-100', trend: '+12%', trendUp: true },
    { label: 'En attente', value: formatCurrency(stats.pendingPayments), icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-100', trend: stats.pendingPayments > 0 ? 'À relancer' : 'OK', trendUp: stats.pendingPayments === 0 },
    { label: 'Messages', value: stats.messagesCount.toString(), icon: MessageCircle, color: 'text-blue-600', bgColor: 'bg-blue-100', trend: '+5', trendUp: true },
    { label: 'Conversion', value: `${stats.conversionRate}%`, icon: Target, color: 'text-purple-600', bgColor: 'bg-purple-100', trend: 'Vis→Cli', trendUp: stats.conversionRate > 1 }
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-slate-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold">Dashboard Business</span>
              <p className="text-xs text-muted-foreground font-normal">{format(new Date(), 'MMMM yyyy', { locale: fr })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BusinessNotificationBadge mcardId={mcard.id} />
            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 text-[10px]">🎯 2026</Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <>
            {/* Monthly Goal */}
            <div className="p-3 bg-white rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-sm">Objectif du mois</span>
                </div>
                <span className="text-xs text-muted-foreground">{formatCurrency(stats.totalRevenue)} / {formatCurrency(stats.monthlyGoal)}</span>
              </div>
              <Progress value={stats.currentProgress} className="h-2.5" />
              <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                <span>{Math.round(stats.currentProgress)}%</span>
                {stats.currentProgress >= 100 ? (
                  <span className="text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Atteint !</span>
                ) : (
                  <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3 text-orange-600" />Reste: {formatCurrency(stats.monthlyGoal - stats.totalRevenue)}</span>
                )}
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-2">
              {kpis.map((kpi, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className={`p-1.5 ${kpi.bgColor} rounded-lg`}><kpi.icon className={`h-3.5 w-3.5 ${kpi.color}`} /></div>
                    <span className={`text-[10px] flex items-center gap-0.5 ${kpi.trendUp ? 'text-green-600' : 'text-orange-600'}`}>
                      {kpi.trendUp ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}{kpi.trend}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold">{kpi.value}</p>
                  <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-3 bg-white rounded-xl border shadow-sm">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Star className="h-4 w-4 text-yellow-600" />Actions rapides</h4>
              <div className="grid grid-cols-2 gap-1.5">
                <Button variant="outline" size="sm" className="justify-start text-xs h-8" onClick={() => setIsInvoiceDialogOpen(true)}>
                  <DollarSign className="h-3.5 w-3.5 mr-1.5" />Facture
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs h-8" onClick={() => setIsClientDialogOpen(true)}>
                  <Users className="h-3.5 w-3.5 mr-1.5" />Clients
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs h-8" onClick={() => {
                  const expenseTracker = document.querySelector('[data-expense-tracker]');
                  if (expenseTracker) {
                    expenseTracker.scrollIntoView({ behavior: 'smooth' });
                    // Trigger the add dialog
                    const addBtn = expenseTracker.querySelector('button');
                    if (addBtn) addBtn.click();
                  }
                }}>
                  <Receipt className="h-3.5 w-3.5 mr-1.5" />Dépense
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs h-8" onClick={() => setIsProductDialogOpen(true)}>
                  <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />Produit
                </Button>
              </div>
            </div>

            {/* Advanced Dashboard with Charts */}
            <MCardAdvancedDashboard mcardId={mcard.id} />

            {/* Expense Tracker */}
            <MCardExpenseTracker mcardId={mcard.id} />

            {/* Stock Manager */}
            <MCardStockManager mcardId={mcard.id} />

            {/* PDF Reports */}
            <MCardPdfReport mcardId={mcard.id} mcardName={mcard.full_name} />

            {/* Marketing & Loyalty */}
            <MCardMarketingCampaigns mcardId={mcard.id} />
            <MCardLoyaltyProgram mcardId={mcard.id} />

            {/* AI Insights */}
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-purple-800">
                <TrendingUp className="h-4 w-4" />💡 Insights IA
              </h4>
              <ul className="space-y-1.5 text-xs text-purple-700">
                {stats.pendingPayments > 0 && (
                  <li className="flex items-start gap-1.5">•<span>{formatCurrency(stats.pendingPayments)} en attente. Relancez vos clients.</span></li>
                )}
                {stats.conversionRate < 2 && (
                  <li className="flex items-start gap-1.5">•<span>Taux de conversion à {stats.conversionRate}%. Ajoutez des témoignages.</span></li>
                )}
                <li className="flex items-start gap-1.5">•<span>Publiez un statut pour +200% de visibilité.</span></li>
              </ul>
            </div>
          </>
        )}

        {/* Dialogs */}
        <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-green-600" />Nouvelle facture</DialogTitle></DialogHeader>
            <InvoiceCreateForm mcardId={mcard.id} onSubmit={handleInvoiceSubmit} onCancel={() => setIsInvoiceDialogOpen(false)} />
          </DialogContent>
        </Dialog>

        <MCardViewAddProductDialog isOpen={isProductDialogOpen} onClose={() => setIsProductDialogOpen(false)} mcardId={mcard.id} mcardPlan={mcard.plan}
          onProductAdded={() => { setIsProductDialogOpen(false); toast({ title: "Produit ajouté" }); }} />

        <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <MCardClientManager mcard={mcard} isOwner={isOwner} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
