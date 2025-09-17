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
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.pending_amount.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">
              En attente de paiement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques d'analyse */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analyse des Ventes
            </CardTitle>
            <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
              <TabsList>
                <TabsTrigger value="day">Jour</TabsTrigger>
                <TabsTrigger value="week">Semaine</TabsTrigger>
                <TabsTrigger value="month">Mois</TabsTrigger>
                <TabsTrigger value="year">Année</TabsTrigger>
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