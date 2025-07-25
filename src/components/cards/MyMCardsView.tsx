import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Eye, 
  Share2, 
  Edit, 
  MoreVertical, 
  ExternalLink,
  Calendar,
  Users,
  Activity
} from "lucide-react";
import { MCard } from "@/types/mcard";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface MyMCardsViewProps {
  mcards: MCard[];
  loading: boolean;
  onEdit: (mcard: MCard) => void;
  onShare: (mcard: MCard) => void;
  onView: (mcard: MCard) => void;
}

export const MyMCardsView = ({ mcards, loading, onEdit, onShare, onView }: MyMCardsViewProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (mcards.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Aucune MCard trouvée</h3>
              <p className="text-gray-600 mt-2">
                Vous n'avez pas encore créé de cartes de visite digitales.
              </p>
            </div>
            <Button className="mt-4">
              Créer ma première MCard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'trial':
        return 'Essai';
      case 'expired':
        return 'Expiré';
      case 'pending_payment':
        return 'En attente';
      default:
        return status;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'essential':
        return 'bg-blue-100 text-blue-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'ultimate':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanText = (plan: string) => {
    switch (plan) {
      case 'essential':
        return 'Essentiel';
      case 'premium':
        return 'Premium';
      case 'ultimate':
        return 'Ultimate';
      default:
        return plan;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total MCards</p>
                <p className="text-2xl font-bold text-gray-900">{mcards.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cartes actives</p>
                <p className="text-2xl font-bold text-green-600">
                  {mcards.filter(card => card.subscription_status === 'active').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vues totales</p>
                <p className="text-2xl font-bold text-purple-600">
                  {mcards.reduce((total, card) => total + (card.view_count || 0), 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MCards List */}
      <div className="space-y-4">
        {mcards.map((mcard) => (
          <Card key={mcard.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={mcard.profile_picture_url || ''} alt={mcard.full_name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {mcard.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {mcard.full_name}
                      </h3>
                      {mcard.is_verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    
                    {mcard.job_title && (
                      <p className="text-gray-600 mb-1">{mcard.job_title}</p>
                    )}
                    
                    {mcard.company && (
                      <p className="text-gray-500 text-sm mb-2">{mcard.company}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{mcard.view_count || 0} vues</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Créé {formatDistanceToNow(new Date(mcard.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getPlanColor(mcard.plan)}>
                      {getPlanText(mcard.plan)}
                    </Badge>
                    <Badge className={getStatusColor(mcard.subscription_status)}>
                      {getStatusText(mcard.subscription_status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(mcard)}
                      className="h-8"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Voir
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onShare(mcard)}
                      className="h-8"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Partager
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => onEdit(mcard)}
                      className="h-8"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};