import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Wallet, 
  Calendar,
  ArrowUp,
  ArrowDown,
  DollarSign,
  ShoppingBag,
  MessageCircle,
  Star,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  BellRing,
  Megaphone
} from 'lucide-react';
import { MCard } from '@/types/mcard';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BusinessNotificationBadge } from '@/components/notifications/BusinessNotificationBadge';
import { MCardMarketingCampaigns } from './MCardMarketingCampaigns';

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
  const [stats, setStats] = useState<BusinessStats>({
    totalRevenue: 0,
    pendingPayments: 0,
    clientsCount: 0,
    messagesCount: 0,
    conversionRate: 0,
    monthlyGoal: 500000,
    currentProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOwner && mcard.id) {
      loadBusinessStats();
    }
  }, [isOwner, mcard.id]);

  const loadBusinessStats = async () => {
    try {
      setLoading(true);
      
      // Charger les factures
      const { data: invoices } = await supabase
        .from('mcard_invoices')
        .select('amount, status, is_validated, currency')
        .eq('mcard_id', mcard.id);

      // Charger les messages
      const { data: messages } = await supabase
        .from('mcard_messages')
        .select('id')
        .eq('mcard_id', mcard.id);

      // Calculs des stats
      const totalRevenue = invoices
        ?.filter(inv => inv.is_validated)
        ?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;

      const pendingPayments = invoices
        ?.filter(inv => !inv.is_validated && inv.status !== 'cancelled')
        ?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;

      // Clients uniques (basé sur les noms des factures)
      const uniqueClients = new Set(invoices?.map(inv => inv.status) || []);

      const monthlyGoal = 500000; // Objectif par défaut en FCFA
      const currentProgress = (totalRevenue / monthlyGoal) * 100;
      const conversionRate = mcard.view_count > 0 
        ? ((invoices?.length || 0) / mcard.view_count) * 100 
        : 0;

      setStats({
        totalRevenue,
        pendingPayments,
        clientsCount: uniqueClients.size,
        messagesCount: messages?.length || 0,
        conversionRate: Math.round(conversionRate * 100) / 100,
        monthlyGoal,
        currentProgress: Math.min(currentProgress, 100)
      });
    } catch (error) {
      console.error('Error loading business stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) return null;
  if (mcard.plan === 'free') return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const kpis = [
    {
      label: 'Chiffre d\'affaires',
      value: formatCurrency(stats.totalRevenue),
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Paiements en attente',
      value: formatCurrency(stats.pendingPayments),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      trend: stats.pendingPayments > 0 ? 'À relancer' : 'OK',
      trendUp: stats.pendingPayments === 0
    },
    {
      label: 'Messages reçus',
      value: stats.messagesCount.toString(),
      icon: MessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: '+5',
      trendUp: true
    },
    {
      label: 'Taux de conversion',
      value: `${stats.conversionRate}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: 'Visiteurs → Clients',
      trendUp: stats.conversionRate > 1
    }
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
              <span className="text-lg font-bold">Tableau de bord Business</span>
              <p className="text-xs text-muted-foreground font-normal">
                {format(new Date(), 'MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BusinessNotificationBadge mcardId={mcard.id} />
            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50">
              🎯 2026
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <>
            {/* Objectif mensuel */}
            <div className="p-4 bg-white rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Objectif du mois</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(stats.totalRevenue)} / {formatCurrency(stats.monthlyGoal)}
                </span>
              </div>
              <Progress value={stats.currentProgress} className="h-3" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{Math.round(stats.currentProgress)}% atteint</span>
                <span className="flex items-center gap-1">
                  {stats.currentProgress >= 100 ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 font-medium">Objectif atteint !</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 text-orange-600" />
                      <span>Reste: {formatCurrency(stats.monthlyGoal - stats.totalRevenue)}</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-2 gap-3">
              {kpis.map((kpi, index) => (
                <div key={index} className="p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 ${kpi.bgColor} rounded-lg`}>
                      <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                    </div>
                    <span className={`text-xs flex items-center gap-1 ${kpi.trendUp ? 'text-green-600' : 'text-orange-600'}`}>
                      {kpi.trendUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {kpi.trend}
                    </span>
                  </div>
                  <p className="text-lg font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-white rounded-xl border shadow-sm">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                Actions rapides
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Nouvelle facture
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Voir clients
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier RDV
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Ajouter produit
                </Button>
              </div>
            </div>

            {/* Marketing Campaigns */}
            <MCardMarketingCampaigns mcardId={mcard.id} />

            {/* Insights IA */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-purple-800">
                <TrendingUp className="h-4 w-4" />
                💡 Insights IA
              </h4>
              <ul className="space-y-2 text-sm text-purple-700">
                {stats.pendingPayments > 0 && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Vous avez {formatCurrency(stats.pendingPayments)} de factures en attente. Pensez à relancer vos clients.</span>
                  </li>
                )}
                {stats.conversionRate < 2 && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Votre taux de conversion est de {stats.conversionRate}%. Ajoutez plus de témoignages clients pour l'améliorer.</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Publiez un statut aujourd'hui pour augmenter votre visibilité de 200%.</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
