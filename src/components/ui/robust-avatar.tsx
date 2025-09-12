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
  const names = name.trim().split(' ');
  const initials = names.map(n => n[0]?.toUpperCase()).filter(Boolean).join('');
  return initials.length > 2 ? initials.substring(0, 2) : initials || "NN";
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
    setImageError(false);
    setIsLoading(false);
    
    if (src && src.trim() !== '') {
      setImageSrc(src);
      setIsLoading(true);
    } else {
      setImageSrc(null);
    }
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.log('Image failed to load:', imageSrc);
    setImageError(true);
    setIsLoading(false);
    setImageSrc(null);
  };

  const initials = getInitials(fallbackText || alt);

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