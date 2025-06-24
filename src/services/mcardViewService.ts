
import { supabase } from '@/integrations/supabase/client';
import { MCard, MCardStatus, MCardProduct } from '@/types/mcard';

export interface MCardData {
  mcard: MCard;
  statuses: MCardStatus[];
  products: MCardProduct[];
  isOwner: boolean;
}

export const fetchMCardBySlug = async (slug: string): Promise<MCard | null> => {
  const { data, error } = await supabase
    .from('mcards')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.log('Carte non trouvée, utilisation de la carte par défaut');
    return null;
  }

  return data;
};

export const fetchMCardStatuses = async (mcardId: string): Promise<MCardStatus[]> => {
  const { data } = await supabase
    .from('mcard_statuses')
    .select('*')
    .eq('mcard_id', mcardId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  // Filter out expired statuses (older than 24h)
  const now = new Date();
  const validStatuses = (data || []).filter(status => {
    // Handle cases where expires_at might not exist in the database yet
    const expiresAt = (status as any).expires_at;
    if (!expiresAt) return true; // Keep statuses without expiration
    const expirationDate = new Date(expiresAt);
    return expirationDate > now;
  });
  
  return validStatuses as MCardStatus[];
};

export const fetchMCardProducts = async (mcardId: string): Promise<MCardProduct[]> => {
  const { data } = await supabase
    .from('mcard_products')
    .select('*')
    .eq('mcard_id', mcardId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  return data || [];
};

export const incrementViewCount = async (slug: string, currentCount: number): Promise<number> => {
  try {
    const { error } = await supabase
      .from('mcards')
      .update({ view_count: currentCount + 1 })
      .eq('slug', slug)
      .eq('is_published', true);
    
    if (!error) {
      return currentCount + 1;
    }
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation du compteur de vues:', error);
  }
  
  return currentCount;
};

export const checkMCardOwnership = async (userId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id === userId;
};
