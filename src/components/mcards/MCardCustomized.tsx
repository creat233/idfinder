import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MCardCustomization } from '@/hooks/useMCardCustomization';
import { applyCustomizationToCard } from '@/utils/mcardCustomization';

interface MCardCustomizedProps {
  mcardId: string;
  children: React.ReactNode;
  className?: string;
}

export const MCardCustomized = ({ mcardId, children, className = '' }: MCardCustomizedProps) => {
  const [customization, setCustomization] = useState<MCardCustomization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomization();
  }, [mcardId]);

  const loadCustomization = async () => {
    try {
      const { data, error } = await supabase
        .from('mcard_customization')
        .select('*')
        .eq('mcard_id', mcardId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors du chargement de la personnalisation:', error);
        return;
      }

      setCustomization(data ? {
        ...data,
        mask_enabled: data.mask_enabled ?? false
      } : null);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={className}>{children}</div>;
  }

  if (!customization) {
    return <div className={className}>{children}</div>;
  }

  const styles = applyCustomizationToCard(customization);
  
  // Créer les particules si activées
  const particlesComponent = styles.particles ? (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  ) : null;

  return (
    <div 
      className={`${styles.container} ${className} transition-all duration-500`}
      style={{ fontFamily: customization.custom_font }}
    >
      {particlesComponent}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};