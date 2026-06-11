import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MCardCustomization } from '@/hooks/useMCardCustomization';

interface MCardCustomizedProps {
  mcardId: string;
  children: React.ReactNode;
  className?: string;
}

const GOOGLE_FONTS = new Set([
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
  'Playfair Display', 'Merriweather', 'Dancing Script', 'Pacifico',
  'Raleway', 'Oswald', 'Nunito', 'Source Sans Pro', 'Bebas Neue',
]);

const loadedFonts = new Set<string>();
const ensureFontLoaded = (font?: string | null) => {
  if (!font || !GOOGLE_FONTS.has(font) || loadedFonts.has(font)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(font);
};

export const MCardCustomized = ({ mcardId, children, className = '' }: MCardCustomizedProps) => {
  const [customization, setCustomization] = useState<MCardCustomization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('mcard_customization')
          .select('*')
          .eq('mcard_id', mcardId)
          .maybeSingle();
        if (error && error.code !== 'PGRST116') {
          console.error('Customization load error:', error);
        }
        if (data) {
          setCustomization({
            ...data,
            mask_enabled: data.mask_enabled ?? false,
            primary_color: data.primary_color ?? '#6366f1',
            secondary_color: data.secondary_color ?? '#ec4899',
            border_radius: data.border_radius ?? 16,
            card_opacity: data.card_opacity ?? 100,
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [mcardId]);

  useEffect(() => {
    ensureFontLoaded(customization?.custom_font);
  }, [customization?.custom_font]);

  if (loading || !customization) {
    return <div className={className}>{children}</div>;
  }

  const primary = customization.primary_color ?? '#6366f1';
  const secondary = customization.secondary_color ?? '#ec4899';
  const gradient = customization.gradients_enabled
    ? `linear-gradient(135deg, ${primary}, ${secondary})`
    : primary;

  const wrapperStyle: React.CSSProperties = {
    background: customization.background_image_url
      ? `linear-gradient(135deg, ${primary}cc, ${secondary}cc), url(${customization.background_image_url}) center/cover no-repeat fixed`
      : gradient,
    borderRadius: `${customization.border_radius ?? 16}px`,
    fontFamily: customization.custom_font
      ? `"${customization.custom_font}", system-ui, sans-serif`
      : undefined,
    boxShadow: customization.shadows_enabled ? '0 25px 50px -12px rgba(0,0,0,0.35)' : undefined,
    padding: '8px',
    position: 'relative',
    overflow: 'hidden',
  };

  const innerStyle: React.CSSProperties = {
    opacity: (customization.card_opacity ?? 100) / 100,
    position: 'relative',
    zIndex: 1,
  };

  const speed = customization.animation_speed ?? 50;
  const duration = `${Math.max(0.3, 2 - speed / 60)}s`;

  return (
    <div className={`${className} transition-all duration-500`} style={wrapperStyle}>
      {customization.particles_enabled && (
        <div className="pointer-events-none absolute inset-0 opacity-40 z-0">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                top: `${(i * 53) % 100}%`,
                left: `${(i * 37) % 100}%`,
                width: `${4 + (i % 4) * 2}px`,
                height: `${4 + (i % 4) * 2}px`,
                background: 'white',
                borderRadius: '9999px',
                animation: `float ${3 + (i % 5)}s ease-in-out ${i * 0.2}s infinite alternate`,
              }}
            />
          ))}
          <style>{`@keyframes float { from { transform: translateY(0); } to { transform: translateY(-20px); } }`}</style>
        </div>
      )}
      <div
        style={innerStyle}
        className={customization.animations_enabled ? 'animate-fade-in' : ''}
        data-anim-duration={duration}
      >
        {children}
      </div>
    </div>
  );
};
