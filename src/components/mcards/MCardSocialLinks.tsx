
import { ExternalLink } from 'lucide-react';
import { 
  Linkedin, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter 
} from 'lucide-react';
import { MCard } from '@/types/mcard';

interface MCardSocialLinksProps {
  mcard: MCard;
}

export const MCardSocialLinks = ({ mcard }: MCardSocialLinksProps) => {
  const socialLinks = [
    { key: 'linkedin_url', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700' },
    { key: 'twitter_url', icon: Twitter, label: 'Twitter/X', color: 'text-gray-900' },
    { key: 'facebook_url', icon: Facebook, label: 'Facebook', color: 'text-blue-600' },
    { key: 'instagram_url', icon: Instagram, label: 'Instagram', color: 'text-pink-600' },
    { key: 'youtube_url', icon: Youtube, label: 'YouTube', color: 'text-red-600' },
    { key: 'tiktok_url', icon: null, label: 'TikTok', color: 'text-gray-900' },
    { key: 'snapchat_url', icon: null, label: 'Snapchat', color: 'text-yellow-500' },
  ];

  const activeSocialLinks = socialLinks.filter(link => 
    mcard[link.key as keyof MCard] && mcard[link.key as keyof MCard] !== ''
  );

  if (activeSocialLinks.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Réseaux sociaux</h3>
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
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              {IconComponent ? (
                <IconComponent className={`h-5 w-5 ${link.color}`} />
              ) : (
                <div className={`h-5 w-5 rounded ${link.color} bg-current opacity-80`}></div>
              )}
              <span className="text-gray-900 text-sm font-medium">{link.label}</span>
              <ExternalLink className="h-4 w-4 ml-auto text-gray-400 group-hover:text-gray-600" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
