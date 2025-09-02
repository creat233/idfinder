
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMCard = async (slug?: string) => {
    try {
      console.log('Starting fetchMCard for slug:', slug);
      
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

      console.log('Fetching real mCard data for slug:', slug);
      const mcardData = await fetchMCardBySlug(slug);
      
      if (!mcardData) {
        console.log('No mCard found for slug:', slug);
        setError(`Carte non trouvée pour le slug: ${slug}`);
        setLoading(false);
        return;
      }

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
        console.error('Error loading additional data:', dataError);
        setStatuses([]);
        setProducts([]);
        setReviews([]);
      }
      
      // Only increment view count for published cards
      if (mcardData.is_published) {
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
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (!mcard || !mcard.slug || mcard.slug === 'demo' || isRefreshing) return;
    
    try {
      // Marquer comme en cours de rafraîchissement pour éviter les appels multiples
      setIsRefreshing(true);
      console.log('Silent background refresh starting...');
      
      // Actualisation en arrière-plan SANS loader ni indication visuelle
      const [mcardData, statusesData, productsData, reviewsData] = await Promise.all([
        fetchMCardBySlug(mcard.slug),
        fetchMCardStatuses(mcard.id),
        fetchMCardProducts(mcard.id),
        fetchAllMCardReviews(mcard.id, isOwner)
      ]);
      
      // Mise à jour silencieuse des données - pas de setState qui cause des re-renders
      if (mcardData && JSON.stringify(mcardData) !== JSON.stringify(mcard)) {
        console.log('MCard data updated silently');
        setMCard(mcardData);
        if (mcardData.view_count !== viewCount) {
          setViewCount(mcardData.view_count || 0);
        }
      }
      
      if (JSON.stringify(statusesData) !== JSON.stringify(statuses)) {
        console.log('Statuses updated silently');
        setStatuses(statusesData);
      }
      
      if (JSON.stringify(productsData) !== JSON.stringify(products)) {
        console.log('Products updated silently');
        setProducts(productsData);
      }
      
      if (JSON.stringify(reviewsData) !== JSON.stringify(reviews)) {
        console.log('Reviews updated silently');
        setReviews(reviewsData);
      }
      
      console.log('Silent background refresh completed');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement silencieux:', error);
      // Ne pas afficher d'erreur pour les rafraîchissements en arrière-plan
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateViewCount = (newCount: number) => {
    if (newCount !== viewCount) {
      setViewCount(newCount);
    }
  };

  const addStatus = (status: MCardStatus) => {
    setStatuses(prev => [status, ...prev]);
  };

  const addProduct = (product: MCardProduct) => {
    setProducts(prev => [product, ...prev]);
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
    updateViewCount,
    setMCard,
    setStatuses,
    setProducts,
    setReviews,
    addStatus,
    addProduct
  };
};
