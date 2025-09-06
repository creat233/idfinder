import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { URL_CONFIG } from '@/utils/urlConfig';

interface ProfileLinkProps {
  profileImageUrl?: string | null;
  fullName: string;
  mcardSlug: string;
  className?: string;
  showName?: boolean;
}

export const ProfileLink = ({ 
  profileImageUrl, 
  fullName, 
  mcardSlug, 
  className = "",
  showName = false
}: ProfileLinkProps) => {
  const handleProfileClick = () => {
    console.log('ProfileLink clicked with slug:', mcardSlug);
    const url = URL_CONFIG.getMCardUrl(mcardSlug);
    console.log('Opening URL:', url);
    window.open(url, '_blank');
  };

  return (
    <div 
      onClick={handleProfileClick}
      className={`cursor-pointer group flex items-center gap-2 hover:opacity-80 transition-opacity ${className}`}
      title={`Voir le profil de ${fullName}`}
    >
      <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-blue-300 transition-all duration-200">
        <AvatarImage src={profileImageUrl || ''} />
        {!profileImageUrl && (
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
            {fullName?.charAt(0) || 'U'}
          </AvatarFallback>
        )}
      </Avatar>
      {showName && (
        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
          {fullName}
        </span>
      )}
      <User className="h-3 w-3 text-gray-400 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100" />
    </div>
  );
};