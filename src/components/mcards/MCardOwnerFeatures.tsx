import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageCircle, 
  BarChart3, 
  FileText, 
  Share2, 
  Heart,
  Eye,
  Zap,
  Crown,
  Star,
  TrendingUp,
  Calendar,
  Download
} from 'lucide-react';

interface MCardOwnerFeaturesProps {
  mcard: {
    id: string;
    slug: string;
    full_name: string;
    plan: string;
    view_count: number;
    is_verified: boolean;
  };
  analytics?: {
    likes_count: number;
    favorites_count: number;
    shares_count: number;
    message_count?: number;
    today_views?: number;
    this_week_views?: number;
  };
}

export function MCardOwnerFeatures({ mcard, analytics }: MCardOwnerFeaturesProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const isPremium = mcard.plan === 'premium';
  const isEssential = mcard.plan === 'essential' || isPremium;

  const features = [
    {
      id: 'analytics',
      title: 'Analyses avancées',
      description: 'Suivez vos performances en temps réel',
      icon: BarChart3,
      available: isEssential,
      isPremium: false
    },
    {
      id: 'messages',
      title: 'Système de messagerie',
      description: 'Recevez des messages de vos visiteurs',
      icon: MessageCircle,
      available: isEssential,
      isPremium: false
    },
    {
      id: 'invoices',
      title: 'Gestion des factures',
      description: 'Créez et gérez vos factures professionnelles',
      icon: FileText,
      available: isEssential,
      isPremium: false
    },
    {
      id: 'products',
      title: 'Catalogue produits/services',
      description: 'Présentez votre offre commerciale',
      icon: Star,
      available: isPremium,
      isPremium: true
    },
    {
      id: 'status',
      title: 'Statuts temporaires',
      description: 'Partagez des actualités éphémères',
      icon: Zap,
      available: isPremium,
      isPremium: true
    },
    {
      id: 'customization',
      title: 'Personnalisation avancée',
      description: 'Thèmes, animations et effets visuels',
      icon: Crown,
      available: isPremium,
      isPremium: true
    }
  ];

  const quickStats = [
    {
      label: 'Vues totales',
      value: mcard.view_count.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      label: 'Likes',
      value: analytics?.likes_count?.toLocaleString() || '0',
      icon: Heart,
      color: 'text-red-600'
    },
    {
      label: 'Favoris',
      value: analytics?.favorites_count?.toLocaleString() || '0',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      label: 'Partages',
      value: analytics?.shares_count?.toLocaleString() || '0',
      icon: Share2,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec statut de vérification */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Espace Propriétaire
              </CardTitle>
              {mcard.is_verified && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Star className="h-3 w-3 mr-1" />
                  Vérifié
                </Badge>
              )}
            </div>
            <Badge variant={isPremium ? 'default' : isEssential ? 'secondary' : 'outline'}>
              {mcard.plan === 'premium' ? 'Premium' : mcard.plan === 'essential' ? 'Essentiel' : 'Gratuit'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Gérez votre carte de visite numérique et accédez aux fonctionnalités exclusives de votre plan.
          </p>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <div>
                  <p className="text-lg font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Onglets des fonctionnalités */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="upgrade">Mise à niveau</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{analytics?.today_views || 0}</p>
                  <p className="text-sm text-muted-foreground">Vues aujourd'hui</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{analytics?.this_week_views || 0}</p>
                  <p className="text-sm text-muted-foreground">Vues cette semaine</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Voir les messages
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Créer une facture
                </Button>
                <Button variant="outline" className="justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyses détaillées
                </Button>
                <Button variant="outline" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter les données
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4">
            {features.map((feature) => (
              <Card key={feature.id} className={!feature.available ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${feature.available ? 'bg-primary/10' : 'bg-muted'}`}>
                        <feature.icon className={`h-5 w-5 ${feature.available ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          {feature.title}
                          {feature.isPremium && <Badge variant="outline" className="text-xs">Premium</Badge>}
                        </h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <div>
                      {feature.available ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Activé
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Indisponible
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upgrade" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Débloquez plus de fonctionnalités</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEssential && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Plan Essentiel - 2000 FCFA/mois
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-3">
                    <li>• Analyses et statistiques détaillées</li>
                    <li>• Système de messagerie professionnel</li>
                    <li>• Gestion complète des factures</li>
                    <li>• Support prioritaire</li>
                  </ul>
                  <Button className="w-full">Passer au plan Essentiel</Button>
                </div>
              )}
              
              {!isPremium && (
                <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Crown className="h-5 w-5 text-purple-600" />
                    Plan Premium - 5000 FCFA/mois
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-3">
                    <li>• Toutes les fonctionnalités Essentiel</li>
                    <li>• Catalogue produits/services illimité</li>
                    <li>• Statuts temporaires et actualités</li>
                    <li>• Personnalisation avancée (thèmes, animations)</li>
                    <li>• Badge de vérification disponible</li>
                    <li>• Analytics avancés et exports de données</li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Passer au plan Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}