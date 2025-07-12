import { MCardCustomization } from '@/hooks/useMCardCustomization';

export const getThemeClasses = (theme: string) => {
  const themes = {
    default: 'bg-gradient-to-br from-blue-500 to-purple-600',
    modern: 'bg-gradient-to-br from-gray-800 to-gray-900 text-white',
    elegant: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white',
    professional: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white',
    creative: 'bg-gradient-to-br from-orange-500 to-red-500 text-white',
    nature: 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
  };
  
  return themes[theme as keyof typeof themes] || themes.default;
};

export const getAnimationClasses = (customization: MCardCustomization) => {
  if (!customization.animations_enabled) return '';
  
  const speed = customization.animation_speed;
  const speedClass = speed <= 30 ? 'animate-slow' : speed <= 70 ? 'animate-normal' : 'animate-fast';
  
  return `animate-fade-in ${speedClass}`;
};

export const getFontFamily = (font: string) => {
  const fontMap = {
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
  
  return fontMap[font as keyof typeof fontMap] || 'font-sans';
};

export const getVisualEffects = (customization: MCardCustomization) => {
  const effects = [];
  
  if (customization.particles_enabled) {
    effects.push('relative overflow-hidden');
  }
  
  if (customization.shadows_enabled) {
    effects.push('shadow-2xl');
  }
  
  return effects.join(' ');
};

export const applyCustomizationToCard = (customization: MCardCustomization) => {
  const themeClasses = getThemeClasses(customization.theme);
  const animationClasses = getAnimationClasses(customization);
  const fontClass = getFontFamily(customization.custom_font);
  const effectsClasses = getVisualEffects(customization);
  
  return {
    container: `${themeClasses} ${animationClasses} ${effectsClasses} ${fontClass}`,
    particles: customization.particles_enabled,
    gradients: customization.gradients_enabled,
    shadows: customization.shadows_enabled,
    font: customization.custom_font
  };
};