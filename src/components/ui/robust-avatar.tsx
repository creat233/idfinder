import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RobustAvatarProps {
  src?: string | null;
  alt: string;
  fallbackText?: string;
  className?: string;
  onClick?: () => void;
}

const getInitials = (name: string): string => {
  if (!name || name.trim() === '') return "NN";
  const names = name.trim().split(' ').filter(n => n.length > 0);
  if (names.length === 0) return "NN";
  
  const initials = names.map(n => n[0]?.toUpperCase()).filter(Boolean).join('');
  return initials.length > 2 ? initials.substring(0, 2) : initials || "NN";
};

const isValidImageUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  
  // Vérifier que c'est une URL valide
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const RobustAvatar = ({ 
  src, 
  alt, 
  fallbackText, 
  className = "", 
  onClick 
}: RobustAvatarProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('RobustAvatar: src changed to:', src);
    setImageError(false);
    setIsLoading(false);
    
    if (src && isValidImageUrl(src)) {
      console.log('RobustAvatar: Setting valid image src to:', src);
      setImageSrc(src);
      setIsLoading(true);
    } else {
      console.log('RobustAvatar: Invalid or empty src, using fallback');
      setImageSrc(null);
    }
  }, [src]);

  const handleImageLoad = () => {
    console.log('RobustAvatar: Image loaded successfully:', imageSrc);
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error('RobustAvatar: Image failed to load:', imageSrc);
    setImageError(true);
    setIsLoading(false);
    setImageSrc(null);
  };

  const initials = getInitials(fallbackText || alt);
  
  console.log('RobustAvatar render:', { 
    src, 
    imageSrc, 
    imageError, 
    isLoading, 
    initials,
    isValidUrl: src ? isValidImageUrl(src) : false
  });

  return (
    <Avatar className={className} onClick={onClick}>
      {imageSrc && !imageError && (
        <AvatarImage 
          src={imageSrc} 
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className="object-cover"
        />
      )}
      <AvatarFallback className="text-white bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 font-bold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};