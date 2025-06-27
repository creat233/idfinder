
import { supabase } from '@/integrations/supabase/client';
import { MCardReview } from '@/types/mcard';

export const fetchMCardReviews = async (mcardId: string): Promise<MCardReview[]> => {
  console.log('Fetching reviews for mCard:', mcardId);
  
  const { data, error } = await supabase
    .from('mcard_reviews')
    .select('*')
    .eq('mcard_id', mcardId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  
  console.log('Reviews retrieved:', data);
  return data || [];
};

export const createMCardReview = async (reviewData: {
  mcard_id: string;
  visitor_name: string;
  visitor_email?: string;
  rating: number;
  comment?: string;
}): Promise<MCardReview | null> => {
  console.log('Creating review:', reviewData);
  
  const { data, error } = await supabase
    .from('mcard_reviews')
    .insert([reviewData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating review:', error);
    throw error;
  }
  
  console.log('Review created:', data);
  return data;
};

export const fetchAllMCardReviews = async (mcardId: string, isOwner: boolean): Promise<MCardReview[]> => {
  console.log('Fetching all reviews for mCard:', mcardId, 'isOwner:', isOwner);
  
  const query = supabase
    .from('mcard_reviews')
    .select('*')
    .eq('mcard_id', mcardId);
  
  // Si ce n'est pas le propriétaire, ne montrer que les avis approuvés
  if (!isOwner) {
    query.eq('is_approved', true);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching all reviews:', error);
    return [];
  }
  
  console.log('All reviews retrieved:', data);
  return data || [];
};

export const approveReview = async (reviewId: string): Promise<void> => {
  console.log('Approving review:', reviewId);
  
  const { error } = await supabase
    .from('mcard_reviews')
    .update({ is_approved: true })
    .eq('id', reviewId);
  
  if (error) {
    console.error('Error approving review:', error);
    throw error;
  }
  
  console.log('Review approved successfully');
};
