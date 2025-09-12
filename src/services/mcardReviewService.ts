
import { supabase } from '@/integrations/supabase/client';
import { MCardReview } from '@/types/mcard';

export const fetchMCardReviews = async (mcardId: string): Promise<MCardReview[]> => {
  console.log('Fetching reviews for mCard:', mcardId);
  
  // Use the secure database function that never exposes emails
  const { data, error } = await supabase
    .rpc('get_public_reviews', { p_mcard_id: mcardId });
  
  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  
  // Map the response to include required fields with safe defaults
  const reviews = (data || []).map(review => ({
    ...review,
    visitor_email: null, // Never expose emails in public reviews
    updated_at: review.created_at, // Use created_at as fallback
    is_approved: true // All returned reviews are approved
  }));
  
  console.log('Reviews retrieved (emails filtered):', reviews);
  return reviews;
};

export const createMCardReview = async (reviewData: {
  mcard_id: string;
  visitor_name: string;
  visitor_email?: string;
  rating: number;
  comment?: string;
}): Promise<MCardReview | null> => {
  console.log('🔍 Création d\'un avis avec les données:', reviewData);
  
  // Vérifier que l'utilisateur est connecté
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.log('❌ Erreur lors de la récupération de l\'utilisateur:', userError);
    throw new Error('Erreur d\'authentification.');
  }
  
  if (!user) {
    console.log('❌ Utilisateur non connecté');
    throw new Error('Vous devez être connecté pour laisser un avis.');
  }
  
  console.log('✅ Utilisateur connecté:', user.email, 'ID:', user.id);
  
  // Vérifier la limite de 7 avis pour la carte
  const { data: existingReviews, error: countError } = await supabase
    .from('mcard_reviews')
    .select('id')
    .eq('mcard_id', reviewData.mcard_id);
  
  if (countError) {
    console.error('Error checking review count:', countError);
    throw countError;
  }
  
  if (existingReviews && existingReviews.length >= 7) {
    throw new Error('Cette carte a atteint la limite maximale de 7 avis.');
  }
  
  console.log('📤 Insertion de l\'avis dans la base de données...');
  
  const { data, error } = await supabase
    .from('mcard_reviews')
    .insert([{
      ...reviewData,
      is_approved: false  // Avis en attente par défaut
    }])
    .select()
    .single();
  
  if (error) {
    console.error('❌ Erreur lors de l\'insertion:', error);
    throw new Error(`Impossible de créer l'avis: ${error.message}`);
  }
  
  if (!data) {
    console.error('❌ Aucune donnée retournée après insertion');
    throw new Error('Erreur lors de la création de l\'avis');
  }
  
  console.log('✅ Avis créé avec succès:', data);
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
