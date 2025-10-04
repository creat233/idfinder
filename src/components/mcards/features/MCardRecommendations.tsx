import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Eye, Heart, Share2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MCard } from '@/types/mcard';
import { RobustAvatar } from '@/components/ui/robust-avatar';

interface Recommendation {
  id: string;
  mcard: MCard;
  score: number;
  reason: string;
  category: 'popular' | 'similar' | 'trending' | 'featured';
}

interface MCardRecommendationsProps {
  currentMCardId?: string;
  userInterests?: string[];
  className?: string;
}

export const MCardRecommendations = ({
  currentMCardId,
  userInterests = [],
  className = ''
}: MCardRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [currentMCardId]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      
      // Si currentMCardId est fourni, récupérer d'abord le user_id du propriétaire
      let ownerUserId = null;
      if (currentMCardId) {
        const { data: currentMCard } = await supabase
          .from('mcards')
          .select('user_id')
          .eq('id', currentMCardId)
          .single();
        
        ownerUserId = currentMCard?.user_id;
      }
      
      // Récupérer uniquement les cartes du même propriétaire si on est sur une MCard
      let query = supabase
        .from('mcards')
        .select(`
          *,
          mcard_analytics (likes_count, favorites_count, shares_count)
        `)
        .eq('is_published', true)
        .neq('id', currentMCardId || '');
      
      // Filtrer par propriétaire si on est sur une MCard spécifique
      if (ownerUserId) {
        query = query.eq('user_id', ownerUserId);
      }
      
      const { data: mcards, error } = await query
        .order('view_count', { ascending: false })
        .limit(6);

      if (error) throw error;

      const processedRecommendations: Recommendation[] = mcards.map(mcard => {
        const analytics = mcard.mcard_analytics[0];
        const totalEngagement = (analytics?.likes_count || 0) + 
                               (analytics?.favorites_count || 0) + 
                               (analytics?.shares_count || 0);
        
        let category: Recommendation['category'] = 'popular';
        let reason = '';
        
        if (mcard.is_verified) {
          category = 'featured';
          reason = 'Profil vérifié et recommandé';
        } else if (totalEngagement > 50) {
          category = 'trending';
          reason = 'Très populaire en ce moment';
        } else if (mcard.view_count > 100) {
          category = 'popular';
          reason = 'Souvent consulté';
        } else {
          reason = 'Profil intéressant à découvrir';
        }

        return {
          id: mcard.id,
          mcard,
          score: mcard.view_count + totalEngagement * 5,
          reason,
          category
        };
      });

      setRecommendations(processedRecommendations);
    } catch (error) {
      console.error('Erreur lors du chargement des recommandations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: Recommendation['category']) => {
    switch (category) {
      case 'featured':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'trending':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'popular':
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Eye className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: Recommendation['category']) => {
    switch (category) {
      case 'featured':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'trending':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'popular':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <Card className={`shadow-lg ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Profils recommandés
        </CardTitle>
        <p className="text-sm text-gray-600">
          Découvrez d'autres profils qui pourraient vous intéresser
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="group">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <RobustAvatar
                  src={rec.mcard.profile_picture_url}
                  alt={rec.mcard.full_name}
                  fallbackText={rec.mcard.full_name}
                  className="w-12 h-12"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {rec.mcard.full_name}
                    </h4>
                    {rec.mcard.is_verified && (
                      <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  
                  {rec.mcard.job_title && (
                    <p className="text-sm text-gray-600 truncate mb-1">
                      {rec.mcard.job_title}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getCategoryColor(rec.category)}`}
                    >
                      {getCategoryIcon(rec.category)}
                      <span className="ml-1">{rec.reason}</span>
                    </Badge>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`/${rec.mcard.slug}`, '_blank')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Voir
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open('/explore', '_blank')}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Découvrir plus de profils
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};