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

export const RobustAvatar = ({ 
  src, 
  alt, 
  fallbackText, 
  className = "", 
  onClick 
}: RobustAvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  // Reset error state and force reload when src changes
  useEffect(() => {
    if (src) {
      setImageError(false);
      // Force refresh of the image by changing key
      setImageKey(prev => prev + 1);
    }
  }, [src]);

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const initials = getInitials(fallbackText || alt);
  const shouldShowImage = src && src.trim() !== '' && !imageError;
  
  // Add timestamp to image URL to prevent caching issues
  const imageSrc = shouldShowImage && src ? `${src}?t=${imageKey}` : src;

  return (
    <Avatar className={className} onClick={onClick}>
      {shouldShowImage && (
        <AvatarImage 
          key={imageKey}
          src={imageSrc} 
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className="object-cover w-full h-full"
        />
      )}
      <AvatarFallback className="text-white bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 font-bold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};