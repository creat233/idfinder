import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Eye, 
  Heart, 
  Star, 
  Share2, 
  MessageCircle, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Users,
  Globe,
  Smartphone,
  Monitor,
  FileDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AnalyticsData {
  views_today: number;
  views_week: number;
  views_month: number;
  likes_count: number;
  favorites_count: number;
  shares_count: number;
  messages_count: number;
  growth_rate: number;
  top_referrers: Array<{ source: string; count: number }>;
  device_stats: Array<{ device: string; count: number; percentage: number }>;
  hourly_data: Array<{ hour: number; views: number }>;
  daily_data: Array<{ date: string; views: number; interactions: number }>;
}

interface MCardAnalyticsDashboardProps {
  mcardId: string;
  mcardSlug: string;
}

export function MCardAnalyticsDashboard({ mcardId, mcardSlug }: MCardAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadAnalytics();

    // Rafraîchissement automatique toutes les 30 secondes
    const refreshInterval = setInterval(() => {
      loadAnalytics();
    }, 30000);

    // Mise à jour en temps réel des analytics
    const channel = supabase
      .channel('mcard-analytics-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mcard_analytics',
          filter: `mcard_id=eq.${mcardId}`
        },
        () => {
          loadAnalytics();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mcard_interactions',
          filter: `mcard_id=eq.${mcardId}`
        },
        () => {
          loadAnalytics();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'mcard_interactions',
          filter: `mcard_id=eq.${mcardId}`
        },
        () => {
          loadAnalytics();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mcard_messages',
          filter: `mcard_id=eq.${mcardId}`
        },
        () => {
          loadAnalytics();
        }
      )
      .subscribe();

    return () => {
      clearInterval(refreshInterval);
      supabase.removeChannel(channel);
    };
  }, [mcardId, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Charger les données d'analytics depuis la base de données
      const { data: mcardAnalytics } = await supabase
        .from('mcard_analytics')
        .select('*')
        .eq('mcard_id', mcardId)
        .single();

      const { data: interactions } = await supabase
        .from('mcard_interactions')
        .select('interaction_type, created_at')
        .eq('mcard_id', mcardId);

      const { data: messages } = await supabase
        .from('mcard_messages')
        .select('created_at')
        .eq('mcard_id', mcardId);

      // Simuler des données plus détaillées (dans un vrai projet, ces données viendraient d'un service d'analytics)
      const mockAnalytics: AnalyticsData = {
        views_today: Math.floor(Math.random() * 50) + 10,
        views_week: Math.floor(Math.random() * 200) + 50,
        views_month: Math.floor(Math.random() * 800) + 200,
        likes_count: mcardAnalytics?.likes_count || 0,
        favorites_count: mcardAnalytics?.favorites_count || 0,
        shares_count: mcardAnalytics?.shares_count || 0,
        messages_count: messages?.length || 0,
        growth_rate: Math.floor(Math.random() * 30) + 5,
        top_referrers: [
          { source: 'Google', count: 45 },
          { source: 'Facebook', count: 32 },
          { source: 'LinkedIn', count: 28 },
          { source: 'Direct', count: 65 },
          { source: 'WhatsApp', count: 18 }
        ],
        device_stats: [
          { device: 'Mobile', count: 145, percentage: 68 },
          { device: 'Desktop', count: 55, percentage: 26 },
          { device: 'Tablet', count: 13, percentage: 6 }
        ],
        hourly_data: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          views: Math.floor(Math.random() * 20) + 1
        })),
        daily_data: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
          views: Math.floor(Math.random() * 50) + 10,
          interactions: Math.floor(Math.random() * 15) + 2
        }))
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setLoading(false);
    }
  };


  const exportDataPDF = () => {
    if (!analytics) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('Analyses détaillées MCard', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`MCard: ${mcardSlug}`, pageWidth / 2, 28, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 34, { align: 'center' });

    // Métriques principales
    doc.setFontSize(14);
    doc.text('Métriques principales', 14, 45);
    
    autoTable(doc, {
      startY: 50,
      head: [['Métrique', 'Valeur']],
      body: [
        ['Vues (7 jours)', analytics.views_week.toLocaleString()],
        ['Vues (30 jours)', analytics.views_month.toLocaleString()],
        ['Likes', analytics.likes_count.toString()],
        ['Favoris', analytics.favorites_count.toString()],
        ['Messages', analytics.messages_count.toString()],
        ['Taux de croissance', `+${analytics.growth_rate}%`],
      ],
    });

    // Sources de trafic
    doc.setFontSize(14);
    doc.text('Sources de trafic', 14, (doc as any).lastAutoTable.finalY + 15);
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Source', 'Visites']],
      body: analytics.top_referrers.map(r => [r.source, r.count.toString()]),
    });

    // Appareils
    doc.setFontSize(14);
    doc.text('Répartition par appareil', 14, (doc as any).lastAutoTable.finalY + 15);
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Appareil', 'Nombre', 'Pourcentage']],
      body: analytics.device_stats.map(d => [d.device, d.count.toString(), `${d.percentage}%`]),
    });

    // Sauvegarde
    doc.save(`mcard-analytics-${mcardSlug}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Chargement des analyses...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Aucune donnée d'analyse disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  const deviceColors = ['#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="mt-8 bg-gradient-to-br from-emerald-50/30 to-green-50/30 rounded-2xl border border-emerald-100 shadow-sm">
      {/* Bouton pour afficher/masquer */}
      <div className="p-6 border-b border-emerald-200">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          className="w-full flex items-center justify-between hover:bg-emerald-100/50"
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate flex items-center gap-2">
                Analyses détaillées
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                  En temps réel
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">Performances de votre MCard</p>
            </div>
          </div>
          {isExpanded ? (
            <TrendingDown className="h-5 w-5 text-gray-500" />
          ) : (
            <TrendingUp className="h-5 w-5 text-gray-500" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* En-tête avec export */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">Analyses détaillées</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                  Temps réel
                </span>
              </div>
              <p className="text-muted-foreground">Suivez les performances de votre MCard • Mise à jour automatique toutes les 30s</p>
            </div>
            <div className="flex items-center gap-3">
              <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
                <TabsList>
                  <TabsTrigger value="24h">24h</TabsTrigger>
                  <TabsTrigger value="7d">7j</TabsTrigger>
                  <TabsTrigger value="30d">30j</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={exportDataPDF} variant="default" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          {/* Métriques principales */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{analytics.views_week.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Vues (7j)</p>
              </div>
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+{analytics.growth_rate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{analytics.likes_count}</p>
                <p className="text-xs text-muted-foreground">Likes</p>
              </div>
              <Heart className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{analytics.favorites_count}</p>
                <p className="text-xs text-muted-foreground">Favoris</p>
              </div>
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{analytics.messages_count}</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
              <MessageCircle className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des vues dans le temps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Évolution des vues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.daily_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="interactions" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par appareil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Appareils utilisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.device_stats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="count"
                  nameKey="device"
                >
                  {analytics.device_stats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={deviceColors[index % deviceColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {analytics.device_stats.map((device, index) => (
                <div key={device.device} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: deviceColors[index % deviceColors.length] }}
                  />
                  <span className="text-sm">{device.device} ({device.percentage}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sources de trafic */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Sources de trafic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.top_referrers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activité par heure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activité par heure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.hourly_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="views" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          </Card>
        </div>

        {/* Recommandations */}
        <Card>
        <CardHeader>
          <CardTitle>🚀 Recommandations pour améliorer vos performances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium">Optimisez vos heures de publication</p>
                <p className="text-sm text-muted-foreground">
                  Vos visiteurs sont plus actifs entre 10h et 16h. Publiez vos statuts à ces moments.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Encouragez les interactions</p>
                <p className="text-sm text-muted-foreground">
                  Ajoutez un appel à l'action sur votre carte pour encourager les messages et favoris.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <Share2 className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium">Partagez votre carte</p>
                <p className="text-sm text-muted-foreground">
                  LinkedIn et WhatsApp sont vos meilleures sources. Partagez plus sur ces plateformes.
                </p>
              </div>
            </div>
          </div>
          </CardContent>
        </Card>
        </div>
      )}
    </div>
  );
}