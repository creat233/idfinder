
import { PromoCodeData } from "@/types/promo";
import { AdminPromoStats } from "@/types/adminPromo";

export const calculatePromoStats = (promoCodes: PromoCodeData[]): AdminPromoStats => {
  const totalCodes = promoCodes.length;
  const activeCodes = promoCodes.filter(code => code.is_active).length;
  const totalUsage = promoCodes.reduce((sum, code) => sum + (code.usage_count || 0), 0);
  const totalEarnings = promoCodes.reduce((sum, code) => sum + (code.total_earnings || 0), 0);

  return {
    totalCodes,
    activeCodes,
    totalUsage,
    totalEarnings
  };
};

export const setupRealtimeSubscription = (onUpdate: () => void) => {
  const { supabase } = require("@/integrations/supabase/client");
  
  const channel = supabase
    .channel('admin-promo-codes-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'promo_codes'
      },
      (payload: any) => {
        console.log('🔄 Changement détecté dans promo_codes:', payload);
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
