import { Card, CardContent } from '@/components/ui/card';
import { RobustAvatar } from '@/components/ui/robust-avatar';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Phone, Mail, Globe, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { OnlineStatusIndicator } from '@/components/mcards/OnlineStatusIndicator';
import { useUserPresence } from '@/hooks/useUserPresence';
import { MCard } from '@/types/mcard';

interface UnverifiedMCardItemProps {
  mcard: MCard;
}

export const UnverifiedMCardItem = ({ mcard }: UnverifiedMCardItemProps) => {
  const navigate = useNavigate();
  
  // Activer la présence pour ce propriétaire de carte
  useUserPresence(mcard.user_id);

  const handleViewCard = (slug: string) => {
    navigate(`/mcard/${slug}`);
  };

  return (
    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="relative">
            <RobustAvatar
              src={mcard.profile_picture_url}
              alt={mcard.full_name}
              fallbackText={mcard.full_name}
              className="h-16 w-16 border-2 border-white/20 group-hover:border-indigo-400/50 transition-colors"
            />
            {/* Badge nouveau talent */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1">
              <Star className="h-4 w-4 text-white fill-white" />
            </div>
          </div>

          {/* Informations principales */}
          <div className="space-y-2 w-full">
            <h3 className="font-bold text-white text-lg leading-tight">
              {mcard.full_name}
            </h3>
            
            {/* Statut en ligne */}
            <div className="flex justify-center">
              <OnlineStatusIndicator userId={mcard.user_id} showText={true} className="text-white" />
            </div>
            
            {mcard.job_title && (
              <div className="flex items-center justify-center gap-2 text-indigo-300">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm">{mcard.job_title}</span>
              </div>
            )}

            {mcard.company && (
              <div className="text-blue-300 text-sm font-medium">
                {mcard.company}
              </div>
            )}

            {mcard.description && (
              <p className="text-white/70 text-sm line-clamp-2">
                {mcard.description}
              </p>
            )}
          </div>

          {/* Contacts rapides */}
          <div className="flex gap-2 w-full">
            {mcard.phone_number && (
              <a 
                href={`tel:${mcard.phone_number}`}
                className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg p-2 transition-colors"
              >
                <Phone className="h-4 w-4 text-green-400 mx-auto" />
              </a>
            )}
            
            {mcard.email && (
              <a 
                href={`mailto:${mcard.email}`}
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg p-2 transition-colors"
              >
                <Mail className="h-4 w-4 text-blue-400 mx-auto" />
              </a>
            )}
            
            {mcard.website_url && (
              <a 
                href={mcard.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 rounded-lg p-2 transition-colors"
              >
                <Globe className="h-4 w-4 text-indigo-400 mx-auto" />
              </a>
            )}
          </div>

          {/* Bouton voir la carte */}
          <Button 
            onClick={() => handleViewCard(mcard.slug)}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Voir la carte
          </Button>

          {/* Statut de l'abonnement */}
          <div className="flex items-center justify-center gap-2 w-full mb-3">
            <Badge variant="outline" className="border-green-400/50 text-green-300 bg-green-500/20 text-sm font-medium px-3 py-1">
              ✓ Actif
            </Badge>
            <Badge variant="outline" className="border-indigo-400/50 text-indigo-300 bg-indigo-500/20 text-sm font-medium px-3 py-1">
              {mcard.plan === 'premium' ? '⭐ Premium' : mcard.plan === 'ultimate' ? '💎 Ultimate' : mcard.plan === 'essential' ? '⚡ Essentiel' : '🆓 Gratuit'}
            </Badge>
          </div>

          {/* Statistiques */}
          <div className="flex items-center justify-center w-full text-sm text-white/60 pt-2 border-t border-white/10">
            <span>{mcard.view_count || 0} vues</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
