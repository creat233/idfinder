
import React from 'react';
import { AdminAd } from '@/types/adminAds';

interface PublicAdProps {
  ad: AdminAd;
}

export const PublicAd: React.FC<PublicAdProps> = ({ ad }) => {
  const AdContent = () => (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-3 text-center sm:text-left">
      {ad.image_url && (
        <div className="flex-shrink-0">
          {ad.image_url.match(/\.(mp4|webm)$/i) ? (
            <video src={ad.image_url} className="h-16 w-auto rounded" controls={false} muted loop playsInline autoPlay />
          ) : (
            <img src={ad.image_url} alt={ad.title} className="h-16 w-auto rounded object-cover" />
          )}
        </div>
      )}
      <div className="flex-grow">
        <h3 className="font-semibold">{ad.title}</h3>
        {ad.message && <p className="text-sm text-gray-600">{ad.message}</p>}
      </div>
    </div>
  );

  if (ad.target_url) {
    return (
      <a href={ad.target_url} target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-100 transition-colors rounded-lg">
        <AdContent />
      </a>
    );
  }

  return <AdContent />;
};
