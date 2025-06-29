
import { useState } from 'react';
import { MCard, MCardStatus, MCardProduct, MCardReview } from '@/types/mcard';
import { createDefaultCard, createDefaultStatuses, createDefaultProducts } from '@/utils/mcardDefaults';
import { 
  fetchMCardBySlug, 
  fetchMCardStatuses, 
  fetchMCardProducts, 
  incrementViewCount, 
  checkMCardOwnership 
} from '@/services/mcardViewService';
import { fetchAllMCardReviews } from '@/services/mcardReviewService';

export const useMCardData = () => {
  const [mcard, setMCard] = useState<MCard | null>(null);
  const [statuses, setStatuses] = useState<MCardStatus[]>([]);
  const [products, setProducts] = useState<MCardProduct[]>([]);
  const [reviews, setReviews] = useState<MCardReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchMCard = async (slug?: string) => {
    try {
      console.log('Fetching mCard for slug:', slug);
      
      if (!slug) {
        console.log('No slug provided, using default card');
        const defaultCard = createDefaultCard();
        setMCard(defaultCard);
        setStatuses(createDefaultStatuses());
        setProducts(createDefaultProducts());
        setViewCount(defaultCard.view_count || 0);
        setLoading(false);
        return;
      }

      if (slug === 'demo') {
        console.log('Demo mode, using default card and products');
        const defaultCard = createDefaultCard();
        const defaultStatuses = createDefaultStatuses();
        const defaultProducts = createDefaultProducts();
        
        setMCard(defaultCard);
        setStatuses(defaultStatuses);
        setProducts(defaultProducts);
        setViewCount(defaultCard.view_count || 0);
        setReviews([]);
        console.log('Demo products loaded:', defaultProducts);
        setLoading(false);
        return;
      }

      console.log('Fetching real mCard data...');
      const mcardData = await fetchMCardBySlug(slug);
      
      if (!mcardData) {
        console.log('No mCard found for slug:', slug);
        setError(`Carte non trouvée pour le slug: ${slug}`);
        const defaultCard = createDefaultCard();
        setMCard(defaultCard);
        setStatuses(createDefaultStatuses());
        setProducts(createDefaultProducts());
        setViewCount(defaultCard.view_count || 0);
      } else {
        console.log('MCard found:', mcardData);
        setMCard(mcardData);
        setViewCount(mcardData.view_count || 0);
        setError(null);
        
        const ownershipStatus = await checkMCardOwnership(mcardData.user_id);
        setIsOwner(ownershipStatus);
        console.log('Is owner:', ownershipStatus);
        
        try {
          const [statusesData, productsData, reviewsData] = await Promise.all([
            fetchMCardStatuses(mcardData.id),
            fetchMCardProducts(mcardData.id),
            fetchAllMCardReviews(mcardData.id, ownershipStatus)
          ]);
          
          console.log('Statuses loaded:', statusesData);
          console.log('Products loaded:', productsData);
          console.log('Reviews loaded:', reviewsData);
          
          setStatuses(statusesData);
          setProducts(productsData);
          setReviews(reviewsData);
        } catch (dataError) {
          console.error('Error loading data:', dataError);
          setStatuses([]);
          setProducts([]);
          setReviews([]);
        }
        
        try {
          const newViewCount = await incrementViewCount(slug, mcardData.view_count || 0);
          setViewCount(newViewCount);
        } catch (viewError) {
          console.error('Error incrementing view count:', viewError);
        }
      }
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la carte:', error);
      setError(`Erreur lors du chargement: ${error.message}`);
      
      const defaultCard = createDefaultCard();
      setMCard(defaultCard);
      setStatuses(createDefaultStatuses());
      setProducts(createDefaultProducts());
      setViewCount(defaultCard.view_count || 0);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (!mcard || !mcard.slug || mcard.slug === 'demo') return;
    
    try {
      const [statusesData, productsData, reviewsData] = await Promise.all([
        fetchMCardStatuses(mcard.id),
        fetchMCardProducts(mcard.id),
        fetchAllMCardReviews(mcard.id, isOwner)
      ]);
      
      setStatuses(statusesData);
      setProducts(productsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    }
  };

  return {
    mcard,
    statuses,
    products,
    reviews,
    loading,
    isOwner,
    viewCount,
    error,
    fetchMCard,
    refreshData,
    setMCard,
    setStatuses,
    setProducts,
    setReviews
  };
};
