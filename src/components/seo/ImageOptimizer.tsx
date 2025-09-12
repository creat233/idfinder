import { useState, useCallback } from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  fallbackSrc?: string;
}

export const ImageOptimizer = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  fallbackSrc = '/placeholder.svg'
}: ImageOptimizerProps) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  }, [imageSrc, fallbackSrc]);

  // Générer srcset pour les images responsives
  const generateSrcSet = (baseSrc: string) => {
    if (baseSrc.includes('placeholder.svg') || baseSrc.includes('blob:')) {
      return undefined;
    }
    
    // Pour les images uploadées ou externes, on peut optimiser
    const sizes = [480, 768, 1024, 1280];
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=75 ${size}w`)
      .join(', ');
  };

  const generateSizes = () => {
    if (!width) return undefined;
    
    return `(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw`;
  };

  return (
    <>
      {/* Preload pour les images prioritaires */}
      {priority && !hasError && (
        <link
          rel="preload"
          as="image"
          href={imageSrc}
          imageSrcSet={generateSrcSet(imageSrc)}
          imageSizes={generateSizes()}
        />
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={priority ? 'eager' : loading}
        srcSet={generateSrcSet(imageSrc)}
        sizes={generateSizes()}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
          objectFit: 'cover'
        }}
      />
      
      {/* Placeholder pendant le chargement */}
      {isLoading && !hasError && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        />
      )}
    </>
  );
};