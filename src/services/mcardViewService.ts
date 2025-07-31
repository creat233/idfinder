
import { supabase } from '@/integrations/supabase/client';
import { MCard, MCardStatus, MCardProduct } from '@/types/mcard';

export interface MCardData {
  mcard: MCard;
  statuses: MCardStatus[];
  products: MCardProduct[];
  isOwner: boolean;
}

export const fetchMCardBySlug = async (slug: string): Promise<MCard | null> => {
  console.log('Fetching mCard by slug:', slug);
  
  // First try with is_published = true
  let { data, error } = await supabase
    .from('mcards')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  // If not found and published, try without is_published filter (for pending cards)
  if (error || !data) {
    console.log('Card not found with is_published=true, trying without filter...');
    const { data: unpublishedData, error: unpublishedError } = await supabase
      .from('mcards')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (unpublishedError) {
      console.error('Error fetching mCard (both attempts):', error, unpublishedError);
      return null;
    }
    
    data = unpublishedData;
    console.log('Found unpublished card:', data);
  }

  console.log('MCard data retrieved:', data);
  return data;
};

export const fetchMCardStatuses = async (mcardId: string): Promise<MCardStatus[]> => {
  console.log('Fetching statuses for mCard:', mcardId);
  
  const { data, error } = await supabase
    .from('mcard_statuses')
    .select('*')
    .eq('mcard_id', mcardId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching statuses:', error);
    return [];
  }
  
  // Filter out expired statuses (older than 24h)
  const now = new Date();
  const validStatuses = (data || []).filter(status => {
    // Handle cases where expires_at might not exist in the database yet
    const expiresAt = (status as any).expires_at;
    if (!expiresAt) return true; // Keep statuses without expiration
    const expirationDate = new Date(expiresAt);
    return expirationDate > now;
  });
  
  console.log('Valid statuses:', validStatuses);
  return validStatuses as MCardStatus[];
};

export const fetchMCardProducts = async (mcardId: string): Promise<MCardProduct[]> => {
  console.log('Fetching products for mCard:', mcardId);
  
  const { data, error } = await supabase
    .from('mcard_products')
    .select('*')
    .eq('mcard_id', mcardId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  console.log('Products retrieved:', data);
  return data || [];
};

export const incrementViewCount = async (slug: string, currentCount: number): Promise<number> => {
  try {
    console.log('Incrementing view count for slug:', slug, 'current count:', currentCount);
    
    // Use the edge function for better reliability
    const { error } = await supabase.functions.invoke('increment-view', {
      body: { slug }
    });
    
    if (!error) {
      console.log('View count incremented successfully via edge function');
      return currentCount + 1;
    } else {
      console.error('Error incrementing view count via edge function:', error);
      
      // Fallback to direct database update
      const { error: dbError } = await supabase
        .from('mcards')
        .update({ view_count: currentCount + 1 })
        .eq('slug', slug)
        .eq('is_published', true);
      
      if (!dbError) {
        console.log('View count incremented successfully via fallback');
        return currentCount + 1;
      } else {
        console.error('Error incrementing view count via fallback:', dbError);
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation du compteur de vues:', error);
  }
  
  return currentCount;
};

export const checkMCardOwnership = async (userId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const isOwner = user?.id === userId;
    console.log('Checking ownership - user ID:', user?.id, 'mCard user ID:', userId, 'is owner:', isOwner);
    return isOwner;
  } catch (error) {
    console.error('Error checking ownership:', error);
    return false;
  }
};
