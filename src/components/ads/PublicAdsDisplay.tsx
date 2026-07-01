import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT = 'ca-pub-2470909766437244';
// TODO: replace with your real AdSense slot ID
const ADSENSE_SLOT = '1234567890';

export const PublicAdsDisplay: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (isDismissed) return;

    // Load AdSense script once
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-adsense="finderid"]'
    );
    if (!existing) {
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
      s.crossOrigin = 'anonymous';
      s.setAttribute('data-adsense', 'finderid');
      document.head.appendChild(s);
    }

    // Push ad slot
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSense push may fail silently before script loads; safe to ignore
    }
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <div className="relative bg-white/60 dark:bg-black/40 border-b border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center min-h-[90px]">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={ADSENSE_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 text-gray-500 hover:text-gray-800"
        onClick={() => setIsDismissed(true)}
        aria-label="Fermer la publicité"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
