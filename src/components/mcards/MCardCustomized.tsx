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
        mask_enabled: data.mask_enabled ?? false,
        primary_color: data.primary_color ?? '#6366f1',
        secondary_color: data.secondary_color ?? '#ec4899',
        border_radius: data.border_radius ?? 16,
        card_opacity: data.card_opacity ?? 100,
      } : null);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !customization) {
    return <div className={className}>{children}</div>;
  }

  const result = applyCustomizationToCard(customization);

  return (
    <div 
      className={`${result.container} ${className} transition-all duration-500`}
      style={result.customStyles}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
