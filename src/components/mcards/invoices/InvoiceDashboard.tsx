import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  FileText, 
  DollarSign, 
  AlertCircle,
  BarChart3,
  Calendar
} from 'lucide-react';
import { InvoiceStats, InvoiceAnalytics } from '@/types/invoice';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, Tooltip } from 'recharts';

interface InvoiceDashboardProps {
  stats: InvoiceStats;
  getAnalytics: (period: 'day' | 'week' | 'month' | 'year') => Promise<InvoiceAnalytics[]>;
}

export const InvoiceDashboard = ({ stats, getAnalytics }: InvoiceDashboardProps) => {
  const [analytics, setAnalytics] = useState<InvoiceAnalytics[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async (period: 'day' | 'week' | 'month' | 'year') => {
    setLoading(true);
    try {
      const data = await getAnalytics(period);
      setAnalytics(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics(selectedPeriod);
  }, [selectedPeriod]);

  const chartConfig = {
    total_amount: {
      label: 'Montant total',
      color: 'hsl(var(--primary))',
    },
    invoice_count: {
      label: 'Nombre de factures',
      color: 'hsl(var(--secondary))',
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Factures</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_invoices}</div>
            <p className="text-xs text-muted-foreground">
              Factures créées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total_amount.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">
              Chiffre d'affaires total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payées</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats.paid_amount.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total_amount > 0 
                ? Math.round((stats.paid_amount / stats.total_amount) * 100)
                : 0}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stats.validated_amount > 0 ? 'Paiement validé' : 'En Attente'}
            </CardTitle>
            <AlertCircle className={`h-4 w-4 ${stats.validated_amount > 0 ? 'text-success' : 'text-warning'}`} />
          </CardHeader>
          <CardContent>
            {stats.validated_amount > 0 ? (
              <>
                <div className="text-2xl font-bold text-success">
                  {stats.validated_amount.toLocaleString()} FCFA
                </div>
                <p className="text-xs text-muted-foreground">
                  Factures validées
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-warning">
                  {stats.pending_amount.toLocaleString()} FCFA
                </div>
                <p className="text-xs text-muted-foreground">
                  En attente de paiement
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Graphiques d'analyse */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              Analyse des Ventes
            </CardTitle>
            <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="day" className="text-xs sm:text-sm px-2 sm:px-3">Jour</TabsTrigger>
                <TabsTrigger value="week" className="text-xs sm:text-sm px-2 sm:px-3">Semaine</TabsTrigger>
                <TabsTrigger value="month" className="text-xs sm:text-sm px-2 sm:px-3">Mois</TabsTrigger>
                <TabsTrigger value="year" className="text-xs sm:text-sm px-2 sm:px-3">Année</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-muted-foreground">Chargement...</div>
            </div>
          ) : analytics.length === 0 ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucune donnée pour cette période
                </p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="amount" className="space-y-4">
              <TabsList>
                <TabsTrigger value="amount">Montants</TabsTrigger>
                <TabsTrigger value="count">Nombre de factures</TabsTrigger>
              </TabsList>

              <TabsContent value="amount">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics}>
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Montant']}
                      />
                      <Bar 
                        dataKey="total_amount" 
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="count">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics}>
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [value, 'Factures']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="invoice_count" 
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};