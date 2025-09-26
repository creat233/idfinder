import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bot, Lightbulb, TrendingUp, Users, MessageSquare, CheckCircle, Sparkles } from 'lucide-react';
import { MCard } from '@/types/mcard';

interface AISuggestion {
  id: string;
  type: 'profile' | 'content' | 'engagement' | 'seo';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  estimated_impact: string;
  applied?: boolean;
}

interface MCardAIAssistantProps {
  mcard: MCard;
  isOwner: boolean;
  analytics?: {
    views: number;
    likes: number;
    favorites: number;
    shares: number;
  };
}

export const MCardAIAssistant = ({
  mcard,
  isOwner,
  analytics = { views: 0, likes: 0, favorites: 0, shares: 0 }
}: MCardAIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && isOwner) {
      generateSuggestions();
    }
  }, [isOpen, isOwner]);

  const generateSuggestions = () => {
    setLoading(true);
    
    // Simulation d'analyse IA et génération de suggestions
    const aiSuggestions: AISuggestion[] = [];

    // Analyse du profil
    if (!mcard.description || mcard.description.length < 50) {
      aiSuggestions.push({
        id: '1',
        type: 'profile',
        priority: 'high',
        title: 'Améliorer votre description',
        description: 'Une description détaillée augmente la confiance et améliore le référencement.',
        action: 'Ajouter au moins 100 caractères décrivant vos services et votre expérience',
        estimated_impact: '+35% de confiance visiteurs'
      });
    }

    if (!mcard.profile_picture_url) {
      aiSuggestions.push({
        id: '2',
        type: 'profile',
        priority: 'high',
        title: 'Ajouter une photo de profil',
        description: 'Les profils avec photo reçoivent 85% plus d\'interactions.',
        action: 'Télécharger une photo professionnelle et souriante',
        estimated_impact: '+85% d\'interactions'
      });
    }

    // Analyse du contenu
    if (analytics.views > 50 && analytics.likes < 5) {
      aiSuggestions.push({
        id: '3',
        type: 'content',
        priority: 'medium',
        title: 'Créer du contenu engageant',
        description: 'Votre taux d\'engagement est faible comparé à vos vues.',
        action: 'Publier des statuts réguliers et ajouter des produits/services',
        estimated_impact: '+150% d\'engagement'
      });
    }

    // Suggestions SEO
    if (!mcard.website_url && !mcard.linkedin_url) {
      aiSuggestions.push({
        id: '4',
        type: 'seo',
        priority: 'medium',
        title: 'Ajouter des liens externes',
        description: 'Les liens vers vos autres présences augmentent votre crédibilité.',
        action: 'Ajouter vos liens LinkedIn, site web ou réseaux sociaux',
        estimated_impact: '+20% de crédibilité'
      });
    }

    // Suggestions d'engagement
    if (!mcard.is_verified && mcard.plan === 'premium') {
      aiSuggestions.push({
        id: '5',
        type: 'engagement',
        priority: 'high',
        title: 'Demander la vérification',
        description: 'Un badge vérifié augmente drastiquement la confiance.',
        action: 'Soumettre votre demande de vérification avec les documents requis',
        estimated_impact: '+200% de confiance'
      });
    }

    if (analytics.views > 100 && analytics.shares < 2) {
      aiSuggestions.push({
        id: '6',
        type: 'engagement',
        priority: 'low',
        title: 'Encourager le partage',
        description: 'Vos visiteurs ne partagent pas assez votre profil.',
        action: 'Ajouter un call-to-action pour encourager le partage',
        estimated_impact: '+50% de portée'
      });
    }

    setSuggestions(aiSuggestions);
    setLoading(false);
  };

  const getPriorityColor = (priority: AISuggestion['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'profile':
        return <Users className="h-4 w-4" />;
      case 'content':
        return <MessageSquare className="h-4 w-4" />;
      case 'engagement':
        return <TrendingUp className="h-4 w-4" />;
      case 'seo':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const applySuggestion = (suggestionId: string) => {
    setSuggestions(prev => 
      prev.map(s => 
        s.id === suggestionId ? { ...s, applied: true } : s
      )
    );
  };

  if (!isOwner) {
    return null;
  }

  const activeSuggestions = suggestions.filter(s => !s.applied);
  const completedSuggestions = suggestions.filter(s => s.applied);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          <Bot className="h-4 w-4 mr-2" />
          Assistant IA
          {activeSuggestions.length > 0 && (
            <Badge className="ml-2 bg-red-500 text-white">
              {activeSuggestions.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Assistant IA - Suggestions d'amélioration
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Améliorez votre profil grâce aux suggestions personnalisées de notre IA
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Analyse de votre profil en cours...</p>
            </div>
          ) : (
            <>
              {/* Suggestions actives */}
              {activeSuggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      Suggestions d'amélioration ({activeSuggestions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getTypeIcon(suggestion.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{suggestion.title}</h4>
                              <Badge className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                                {suggestion.priority === 'high' ? 'Priorité haute' : 
                                 suggestion.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {suggestion.description}
                            </p>
                            
                            <p className="text-sm font-medium text-blue-700 mb-3">
                              📈 Impact estimé: {suggestion.estimated_impact}
                            </p>
                            
                            <div className="bg-blue-50 p-3 rounded-lg mb-3">
                              <p className="text-sm"><strong>Action recommandée:</strong></p>
                              <p className="text-sm text-gray-700">{suggestion.action}</p>
                            </div>
                            
                            <Button
                              size="sm"
                              onClick={() => applySuggestion(suggestion.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marquer comme appliqué
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Suggestions complétées */}
              {completedSuggestions.length > 0 && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      Améliorations appliquées ({completedSuggestions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {completedSuggestions.map((suggestion) => (
                        <div key={suggestion.id} className="flex items-center gap-2 text-sm text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span>{suggestion.title}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Message si aucune suggestion */}
              {suggestions.length === 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="text-center py-8">
                    <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-blue-800 mb-2">Profil optimisé !</h3>
                    <p className="text-blue-600">
                      Votre profil est déjà bien optimisé. Continuez à publier du contenu régulièrement.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Stats d'amélioration */}
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-purple-800 mb-3">📊 Analyse de performance</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Vues totales</p>
                      <p className="font-semibold text-lg">{analytics.views}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Engagement</p>
                      <p className="font-semibold text-lg">{analytics.likes + analytics.favorites + analytics.shares}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};