import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bot, Lightbulb, TrendingUp, Users, MessageSquare, CheckCircle, Sparkles, Target, Calendar, ShoppingBag, Star, Share2, MapPin } from 'lucide-react';
import { MCard } from '@/types/mcard';

interface AISuggestion {
  id: string;
  type: 'profile' | 'content' | 'engagement' | 'seo' | 'business' | 'daily';
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

// Suggestions quotidiennes pour développer l'entreprise
const getDailySuggestions = (): AISuggestion[] => {
  const dailyTips: AISuggestion[] = [
    {
      id: 'daily-1',
      type: 'daily',
      priority: 'medium',
      title: '💡 Astuce du jour: Publiez un statut',
      description: 'Les profils qui publient régulièrement des statuts obtiennent 3x plus de vues.',
      action: 'Partagez une actualité, promotion ou témoignage client sur votre profil aujourd\'hui.',
      estimated_impact: '+200% de visibilité'
    },
    {
      id: 'daily-2',
      type: 'daily',
      priority: 'medium',
      title: '💡 Astuce du jour: Photos de qualité',
      description: 'Les produits avec de belles photos se vendent 40% mieux.',
      action: 'Prenez de nouvelles photos de vos produits/services avec un bon éclairage naturel.',
      estimated_impact: '+40% de conversions'
    },
    {
      id: 'daily-3',
      type: 'daily',
      priority: 'medium',
      title: '💡 Astuce du jour: Demandez des avis',
      description: 'Les avis clients augmentent la confiance des nouveaux visiteurs.',
      action: 'Contactez 3 clients satisfaits et demandez-leur de laisser un avis sur votre carte.',
      estimated_impact: '+60% de confiance'
    },
    {
      id: 'daily-4',
      type: 'daily',
      priority: 'medium',
      title: '💡 Astuce du jour: Partagez votre carte',
      description: 'Le partage sur les réseaux sociaux multiplie votre audience.',
      action: 'Partagez votre carte MCard sur WhatsApp, Facebook ou Instagram avec un message engageant.',
      estimated_impact: '+300% de portée'
    },
    {
      id: 'daily-5',
      type: 'daily',
      priority: 'medium',
      title: '💡 Astuce du jour: Mettez à jour vos prix',
      description: 'Des prix clairs et à jour rassurent les clients potentiels.',
      action: 'Vérifiez que tous vos produits/services ont des prix actuels et compétitifs.',
      estimated_impact: '+25% de demandes'
    },
    {
      id: 'daily-6',
      type: 'daily',
      priority: 'medium',
      title: '💡 Astuce du jour: Ajoutez votre localisation',
      description: 'Les clients aiment savoir où vous trouver - une localisation précise augmente la confiance.',
      action: 'Ajoutez ou mettez à jour votre lien Google Maps pour faciliter les visites.',
      estimated_impact: '+45% de visites physiques'
    },
    {
      id: 'daily-7',
      type: 'daily',
      priority: 'medium',
      title: '💡 Astuce du jour: Répondez rapidement',
      description: 'Les réponses rapides augmentent les chances de conversion de 78%.',
      action: 'Activez les notifications et répondez aux messages dans l\'heure si possible.',
      estimated_impact: '+78% de conversions'
    }
  ];

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const index1 = dayOfYear % dailyTips.length;
  const index2 = (dayOfYear + 3) % dailyTips.length;
  
  return [dailyTips[index1], dailyTips[index2]];
};

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
    
    const aiSuggestions: AISuggestion[] = [];

    // Ajouter les 2 suggestions quotidiennes
    const dailySuggestions = getDailySuggestions();
    aiSuggestions.push(...dailySuggestions);

    // Analyse du profil
    if (!mcard.description || mcard.description.length < 50) {
      aiSuggestions.push({
        id: '1',
        type: 'profile',
        priority: 'high',
        title: 'Améliorer votre description',
        description: 'Une description détaillée augmente la confiance et améliore le référencement.',
        action: 'Ajouter au moins 100 caractères décrivant vos services, votre expertise et ce qui vous différencie.',
        estimated_impact: '+35% de confiance visiteurs'
      });
    }

    if (!mcard.profile_picture_url) {
      aiSuggestions.push({
        id: '2',
        type: 'profile',
        priority: 'high',
        title: 'Ajouter une photo de profil professionnelle',
        description: 'Les profils avec photo reçoivent 85% plus d\'interactions.',
        action: 'Téléchargez une photo professionnelle de vous ou votre logo d\'entreprise.',
        estimated_impact: '+85% d\'interactions'
      });
    }

    // Localisation
    if (!mcard.maps_location_url) {
      aiSuggestions.push({
        id: 'loc-1',
        type: 'business',
        priority: 'high',
        title: 'Ajouter votre localisation Google Maps',
        description: 'Les clients veulent savoir où vous êtes situé pour faciliter les visites.',
        action: 'Ajoutez votre lien Google Maps dans la section contact pour que les clients puissent vous trouver facilement.',
        estimated_impact: '+50% de visites physiques'
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
        action: 'Publiez des statuts réguliers avec vos réalisations, promotions ou témoignages clients.',
        estimated_impact: '+150% d\'engagement'
      });
    }

    // Suggestions Business
    aiSuggestions.push({
      id: 'biz-1',
      type: 'business',
      priority: 'medium',
      title: 'Utilisez les devis et factures',
      description: 'Professionnalisez vos transactions avec les outils de facturation intégrés.',
      action: 'Créez des devis professionnels pour vos clients et convertissez-les en factures.',
      estimated_impact: '+30% de professionnalisme'
    });

    // Suggestions SEO
    if (!mcard.website_url && !mcard.linkedin_url) {
      aiSuggestions.push({
        id: '4',
        type: 'seo',
        priority: 'medium',
        title: 'Ajouter des liens vers vos réseaux',
        description: 'Les liens vers vos autres présences augmentent votre crédibilité.',
        action: 'Connectez votre LinkedIn, Facebook, Instagram et site web.',
        estimated_impact: '+20% de crédibilité'
      });
    }

    // Suggestions d'engagement
    if (!mcard.is_verified && (mcard.plan === 'premium' || mcard.plan === 'essential')) {
      aiSuggestions.push({
        id: '5',
        type: 'engagement',
        priority: 'high',
        title: 'Obtenez le badge vérifié',
        description: 'Un badge vérifié augmente drastiquement la confiance des clients.',
        action: 'Soumettez votre demande de vérification avec une pièce d\'identité.',
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
        action: 'Demandez à vos clients satisfaits de partager votre carte à leurs contacts.',
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
      case 'business':
        return <ShoppingBag className="h-4 w-4" />;
      case 'daily':
        return <Calendar className="h-4 w-4" />;
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
  const dailySuggestions = activeSuggestions.filter(s => s.type === 'daily');
  const otherSuggestions = activeSuggestions.filter(s => s.type !== 'daily');
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
            Assistant IA - Développez votre entreprise
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Suggestions personnalisées pour optimiser votre MCard et attirer plus de clients
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
              {dailySuggestions.length > 0 && (
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                      <Calendar className="h-5 w-5" />
                      Astuces du jour ({dailySuggestions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dailySuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="bg-white border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            {getTypeIcon(suggestion.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">{suggestion.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                            <p className="text-sm font-medium text-amber-700 mb-3">
                              📈 Impact estimé: {suggestion.estimated_impact}
                            </p>
                            <div className="bg-amber-50 p-3 rounded-lg mb-3">
                              <p className="text-sm"><strong>Action recommandée:</strong></p>
                              <p className="text-sm text-gray-700">{suggestion.action}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => applySuggestion(suggestion.id)}
                              className="bg-amber-600 hover:bg-amber-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              C'est fait !
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {otherSuggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      Améliorations recommandées ({otherSuggestions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {otherSuggestions.map((suggestion) => (
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
                            <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
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

              {suggestions.length === 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="text-center py-8">
                    <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-blue-800 mb-2">Profil optimisé !</h3>
                    <p className="text-blue-600">
                      Votre profil est bien optimisé. Continuez à publier du contenu régulièrement.
                    </p>
                  </CardContent>
                </Card>
              )}

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

              <Card className="bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-200">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Fonctionnalités pour votre entreprise
                  </h4>
                  <ul className="space-y-2 text-sm text-indigo-700">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Devis & Factures professionnels
                    </li>
                    <li className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Messagerie directe avec vos clients
                    </li>
                    <li className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Partage QR Code pour vos supports marketing
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localisation Google Maps
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Statistiques de performance
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
