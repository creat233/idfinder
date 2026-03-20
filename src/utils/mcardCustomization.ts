import { MCardCustomization } from '@/hooks/useMCardCustomization';

export const getThemeClasses = (theme: string) => {
  const themes: Record<string, string> = {
    default: 'bg-gradient-to-br from-blue-500 to-purple-600',
    modern: 'bg-gradient-to-br from-gray-800 to-gray-900 text-white',
    elegant: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white',
    professional: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white',
    creative: 'bg-gradient-to-br from-orange-500 to-red-500 text-white',
    nature: 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
  };
  
  return themes[theme] || themes.default;
};

export const getAnimationClasses = (customization: MCardCustomization) => {
  if (!customization.animations_enabled) return '';
  
  const speed = customization.animation_speed;
  const speedClass = speed <= 30 ? 'animate-slow' : speed <= 70 ? 'animate-normal' : 'animate-fast';
  
  return `animate-fade-in ${speedClass}`;
};

export const getFontFamily = (font: string) => {
  const fontMap: Record<string, string> = {
    'Inter': 'font-sans',
    'Roboto': 'font-sans',
    'Open Sans': 'font-sans',
    'Lato': 'font-sans',
    'Montserrat': 'font-sans',
    'Poppins': 'font-sans',
    'Playfair Display': 'font-serif',
    'Merriweather': 'font-serif',
    'Dancing Script': 'font-cursive',
    'Pacifico': 'font-cursive'
  };
  
  return fontMap[font] || 'font-sans';
};

export const getVisualEffects = (customization: MCardCustomization) => {
  const effects = [];
  
  if (customization.particles_enabled) {
    effects.push('relative overflow-hidden');
  }
  
  if (customization.shadows_enabled) {
    effects.push('shadow-2xl');
  }
  
  if (customization.mask_enabled) {
    effects.push('mask-creative');
  }
  
  return effects.join(' ');
};

export const getCustomStyles = (customization: MCardCustomization): React.CSSProperties => {
  const styles: React.CSSProperties = {};

  if (customization.primary_color && customization.secondary_color) {
    styles.background = `linear-gradient(135deg, ${customization.primary_color}, ${customization.secondary_color})`;
  }

  if (customization.border_radius !== undefined) {
    styles.borderRadius = `${customization.border_radius}px`;
  }

  if (customization.card_opacity !== undefined) {
    styles.opacity = customization.card_opacity / 100;
  }

  if (customization.custom_font) {
    styles.fontFamily = customization.custom_font;
  }

  return styles;
};

export const applyCustomizationToCard = (customization: MCardCustomization) => {
  const themeClasses = getThemeClasses(customization.theme);
  const animationClasses = getAnimationClasses(customization);
  const fontClass = getFontFamily(customization.custom_font);
  const effectsClasses = getVisualEffects(customization);
  const customStyles = getCustomStyles(customization);
  const hasCustomColors = customization.primary_color && customization.secondary_color && 
    customization.primary_color !== '#6366f1';
  
  return {
    container: `${hasCustomColors ? '' : themeClasses} ${animationClasses} ${effectsClasses} ${fontClass}`.trim(),
    customStyles,
    particles: customization.particles_enabled,
    gradients: customization.gradients_enabled,
    shadows: customization.shadows_enabled,
    font: customization.custom_font
  };
};
