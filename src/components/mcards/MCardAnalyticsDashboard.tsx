import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Eye, Heart, Bookmark, Share, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MCardAnalyticsProps {
  mcardId: string;
  isVerified: boolean;
}

interface Analytics {
  likes_count: number;
  favorites_count: number;
  shares_count: number;
  view_count: number;
  created_at: string;
}

export const MCardAnalyticsDashboard = ({ mcardId, isVerified }: MCardAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isVerified) {
      loadAnalytics();
    } else {
      setLoading(false);
    }
  }, [mcardId, isVerified]);

  const loadAnalytics = async () => {
    try {
      // Récupérer les analytics de la table mcard_analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('mcard_analytics')
        .select('likes_count, favorites_count, shares_count, created_at')
        .eq('mcard_id', mcardId)
        .single();

      if (analyticsError && analyticsError.code !== 'PGRST116') {
        throw analyticsError;
      }

      // Récupérer le view_count de la table mcards
      const { data: mcardData, error: mcardError } = await supabase
        .from('mcards')
        .select('view_count')
        .eq('id', mcardId)
        .single();

      if (mcardError) throw mcardError;

      // Si pas d'analytics, initialiser
      if (!analyticsData) {
        const { error: insertError } = await supabase
          .from('mcard_analytics')
          .insert({ mcard_id: mcardId });

        if (insertError) throw insertError;

        setAnalytics({
          likes_count: 0,
          favorites_count: 0,
          shares_count: 0,
          view_count: mcardData?.view_count || 0,
          created_at: new Date().toISOString()
        });
      } else {
        setAnalytics({
          ...analyticsData,
          view_count: mcardData?.view_count || 0
        });
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des analytics:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les statistiques"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isVerified) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-blue-700">
            <TrendingUp className="h-5 w-5" />
            Tableau de Bord Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
            <p className="text-blue-800 font-medium mb-2">🔒 Fonctionnalité Premium</p>
            <p className="text-blue-600 text-sm">
              Le tableau de bord analytics n'est disponible que pour les cartes vérifiées.
              Demandez la vérification de votre carte pour accéder à ces statistiques détaillées.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tableau de Bord Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Chargement des statistiques...</div>
        </CardContent>
      </Card>
    );
  }

  const statsCards = [
    {
      title: "Vues",
      value: analytics?.view_count || 0,
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Nombre total de vues"
    },
    {
      title: "J'aime",
      value: analytics?.likes_count || 0,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Réactions positives"
    },
    {
      title: "Favoris",
      value: analytics?.favorites_count || 0,
      icon: Bookmark,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Ajouts en favoris"
    },
    {
      title: "Partages",
      value: analytics?.shares_count || 0,
      icon: Share,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Partages effectués"
    }
  ];

  const totalEngagement = (analytics?.likes_count || 0) + (analytics?.favorites_count || 0) + (analytics?.shares_count || 0);
  const engagementRate = analytics?.view_count ? ((totalEngagement / analytics.view_count) * 100).toFixed(1) : '0';

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <TrendingUp className="h-5 w-5" />
            Tableau de Bord Analytics
          </CardTitle>
          <Badge variant="default" className="bg-purple-600">
            Carte Vérifiée
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsCards.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.title} className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}>
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-sm font-medium text-gray-700">{stat.title}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-1">{stat.description}</div>
              </div>
            );
          })}
        </div>

        {/* Métriques avancées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Taux d'Engagement</span>
            </div>
            <div className="text-2xl font-bold text-indigo-600">{engagementRate}%</div>
            <div className="text-xs text-gray-600 mt-1">
              {totalEngagement} interactions sur {analytics?.view_count || 0} vues
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Créée le</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {analytics?.created_at ? new Date(analytics.created_at).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-xs text-gray-600 mt-1">Date de création de la carte</div>
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-2">📊 Résumé de Performance</h4>
          <div className="text-sm text-purple-700">
            Votre carte a généré <strong>{analytics?.view_count || 0} vues</strong> avec un total de{' '}
            <strong>{totalEngagement} interactions</strong>, soit un taux d'engagement de{' '}
            <strong>{engagementRate}%</strong>.
            {totalEngagement > 0 ? (
              <span className="block mt-1 text-green-700">
                ✨ Excellent travail ! Votre contenu engage votre audience.
              </span>
            ) : (
              <span className="block mt-1 text-blue-700">
                💡 Partagez votre carte pour augmenter l'engagement !
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};