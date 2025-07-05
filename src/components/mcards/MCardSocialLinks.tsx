
import { ExternalLink } from 'lucide-react';
import { 
  Linkedin, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter,
  MessageCircle,
  Star
} from 'lucide-react';
import { MCard } from '@/types/mcard';

interface MCardSocialLinksProps {
  mcard: MCard;
}

export const MCardSocialLinks = ({ mcard }: MCardSocialLinksProps) => {
  const socialLinks = [
    { key: 'linkedin_url', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700', bgColor: 'bg-blue-50 hover:bg-blue-100' },
    { key: 'twitter_url', icon: Twitter, label: 'Twitter/X', color: 'text-gray-900', bgColor: 'bg-gray-50 hover:bg-gray-100' },
    { key: 'facebook_url', icon: Facebook, label: 'Facebook', color: 'text-blue-600', bgColor: 'bg-blue-50 hover:bg-blue-100' },
    { key: 'instagram_url', icon: Instagram, label: 'Instagram', color: 'text-pink-600', bgColor: 'bg-pink-50 hover:bg-pink-100' },
    { key: 'youtube_url', icon: Youtube, label: 'YouTube', color: 'text-red-600', bgColor: 'bg-red-50 hover:bg-red-100' },
    { key: 'tiktok_url', icon: null, label: 'TikTok', color: 'text-gray-900', bgColor: 'bg-gray-50 hover:bg-gray-100' },
    { key: 'snapchat_url', icon: null, label: 'Snapchat', color: 'text-yellow-500', bgColor: 'bg-yellow-50 hover:bg-yellow-100' },
    { key: 'telegram_url', icon: MessageCircle, label: 'Telegram', color: 'text-blue-500', bgColor: 'bg-blue-50 hover:bg-blue-100' },
    { key: 'google_business_url', icon: Star, label: 'Laisser un avis Google', color: 'text-orange-600', bgColor: 'bg-orange-50 hover:bg-orange-100' },
    { key: 'maps_location_url', icon: null, label: '📍 Voir sur Maps', color: 'text-green-600', bgColor: 'bg-green-50 hover:bg-green-100' },
  ];

  const activeSocialLinks = socialLinks.filter(link => 
    mcard[link.key as keyof MCard] && mcard[link.key as keyof MCard] !== ''
  );

  if (activeSocialLinks.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Réseaux sociaux & Avis</h3>
      <div className="grid grid-cols-2 gap-3">
        {activeSocialLinks.map((link) => {
          const url = mcard[link.key as keyof MCard] as string;
          const IconComponent = link.icon;
          
          return (
            <a
              key={link.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors group ${link.bgColor}`}
            >
              {IconComponent ? (
                <IconComponent className={`h-5 w-5 ${link.color}`} />
              ) : (
                <div className={`h-5 w-5 rounded ${link.color.replace('text-', 'bg-')} opacity-80`}></div>
              )}
              <span className="text-gray-900 text-sm font-medium flex-1">{link.label}</span>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
