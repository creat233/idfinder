import { Smartphone } from 'lucide-react';
import { MCardCustomization } from '@/hooks/useMCardCustomization';
import { MCard } from '@/types/mcard';

interface LivePreviewProps {
  customization: MCardCustomization;
  mcard: MCard;
}

export const LivePreview = ({ customization, mcard }: LivePreviewProps) => {
  const gradient = `linear-gradient(135deg, ${customization.primary_color ?? '#6366f1'}, ${customization.secondary_color ?? '#ec4899'})`;
  const radius = `${customization.border_radius ?? 16}px`;
  const opacity = (customization.card_opacity ?? 100) / 100;

  const cardStyle: React.CSSProperties = {
    background: customization.background_image_url
      ? `linear-gradient(135deg, ${customization.primary_color}cc, ${customization.secondary_color}cc), url(${customization.background_image_url}) center/cover`
      : gradient,
    borderRadius: radius,
    opacity,
    fontFamily: customization.custom_font || 'Inter',
    boxShadow: customization.shadows_enabled ? '0 25px 50px -12px rgba(0,0,0,0.5)' : 'none',
  };

  return (
    <div className="sticky top-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Smartphone className="h-4 w-4 text-purple-600" />
        Aperçu en direct
      </h3>
      <div className="mx-auto" style={{ maxWidth: 260 }}>
        <div className="bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
          <div className="bg-white rounded-[1.7rem] overflow-hidden aspect-[9/16]">
            <div className="p-3 h-full overflow-hidden">
              <div
                className={`p-4 text-white relative overflow-hidden ${
                  customization.animations_enabled ? 'animate-fade-in' : ''
                }`}
                style={cardStyle}
              >
                {customization.particles_enabled && (
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-2 left-3 w-1.5 h-1.5 bg-white rounded-full" />
                    <div className="absolute top-8 right-4 w-1 h-1 bg-white rounded-full" />
                    <div className="absolute bottom-4 left-8 w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-white/30 mx-auto mb-2 overflow-hidden">
                    {mcard.profile_picture_url && (
                      <img src={mcard.profile_picture_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <p className="text-center font-bold text-sm truncate">{mcard.full_name}</p>
                  {mcard.job_title && (
                    <p className="text-center text-xs opacity-90 truncate">{mcard.job_title}</p>
                  )}
                  {mcard.description && (
                    <p className="text-center text-[10px] opacity-80 mt-2 line-clamp-2">
                      {mcard.description}
                    </p>
                  )}
                  <div className="flex justify-center gap-1.5 mt-3">
                    <div className="px-2 py-1 bg-white/30 rounded-md text-[9px]">Appeler</div>
                    <div className="px-2 py-1 bg-white/30 rounded-md text-[9px]">WhatsApp</div>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-gray-400 text-center mt-2">Aperçu simulé</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
