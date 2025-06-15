
import React, { useState, useEffect } from 'react';
import { usePublicAds } from '@/hooks/usePublicAds';
import { PublicAd } from './PublicAd';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export const PublicAdsDisplay: React.FC = () => {
  const { ads, loading } = usePublicAds();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 7000); // Change ad every 7 seconds

      return () => clearInterval(interval);
    }
  }, [ads.length]);

  if (loading || ads.length === 0 || isDismissed) {
    return null;
  }

  return (
    <div className="relative bg-yellow-50 border-b border-yellow-200">
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAdIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PublicAd ad={ads[currentAdIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 text-gray-500 hover:text-gray-800"
        onClick={() => setIsDismissed(true)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Fermer la publicité</span>
      </Button>
    </div>
  );
};
