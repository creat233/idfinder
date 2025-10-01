
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
  
  try {
    // IMPORTANT: Always check if current user owns this card FIRST
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Try to fetch as owner first to get complete data
      const { data: ownedCard, error: ownedError } = await supabase
        .from('mcards')
        .select('*')
        .eq('slug', slug)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!ownedError && ownedCard) {
        console.log('✅ Owned MCard found with full data:', ownedCard.full_name);
        console.log('   Owner will see management interface');
        return ownedCard;
      }
    }

    // Not the owner or not logged in - use public data function
    const { data: publicData, error: publicError } = await supabase
      .rpc('get_public_mcard_data', { p_slug: slug });

    if (publicError) {
      console.error('Error fetching public MCard data:', publicError);
      return null;
    }

    if (publicData && publicData.length > 0) {
      const mcard = publicData[0];
      console.log('👁️ Public MCard found:', mcard.full_name);
      console.log('   Visitor will see public interface');
      return mcard as MCard;
    }

    console.log('❌ No MCard found with slug:', slug);
    return null;
  } catch (networkError) {
    console.error('Network error fetching mCard:', networkError);
    // Return cached data if available
    const cachedData = localStorage.getItem(`mcard_${slug}`);
    if (cachedData) {
      console.log('Using cached mCard data due to network error');
      return JSON.parse(cachedData);
    }
    return null;
  }
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

// Vérifier si une vue a déjà été comptée pour cette carte dans cette session
const hasViewedCard = (slug: string): boolean => {
  try {
    const viewedCards = JSON.parse(localStorage.getItem('viewedCards') || '[]');
    return viewedCards.includes(slug);
  } catch {
    return false;
  }
};

// Marquer une carte comme vue dans cette session
const markCardAsViewed = (slug: string): void => {
  try {
    const viewedCards = JSON.parse(localStorage.getItem('viewedCards') || '[]');
    if (!viewedCards.includes(slug)) {
      viewedCards.push(slug);
      localStorage.setItem('viewedCards', JSON.stringify(viewedCards));
    }
  } catch {
    // Ignore localStorage errors
  }
};

export const incrementViewCount = async (slug: string, currentCount: number): Promise<number> => {
  // Vérifier si cette carte a déjà été vue dans cette session
  if (hasViewedCard(slug)) {
    console.log('Card already viewed in this session, not incrementing:', slug);
    return currentCount;
  }

  try {
    console.log('Incrementing view count for slug:', slug, 'current count:', currentCount);
    
    // Use the edge function for better reliability
    const { error } = await supabase.functions.invoke('increment-view', {
      body: { slug }
    });
    
    if (!error) {
      console.log('View count incremented successfully via edge function');
      // Marquer la carte comme vue
      markCardAsViewed(slug);
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
        // Marquer la carte comme vue
        markCardAsViewed(slug);
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
    // Vérifier d'abord la session active
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return false;
    }
    
    if (!session || !session.user) {
      console.log('No active session or user found');
      return false;
    }
    
    const isOwner = session.user.id === userId;
    console.log('🔍 Checking ownership:');
    console.log('  - Authenticated user ID:', session.user.id);
    console.log('  - MCard owner ID:', userId);
    console.log('  - Is owner:', isOwner);
    console.log('  - User email:', session.user.email);
    
    return isOwner;
  } catch (error) {
    console.error('Error checking ownership:', error);
    return false;
  }
};
