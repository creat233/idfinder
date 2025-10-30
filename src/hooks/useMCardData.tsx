
import { useState, useRef } from 'react';
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
import { offlineStorage } from '@/services/offlineStorage';
import { useOfflineSync } from './useOfflineSync';

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
  const loadedSlugRef = useRef<string | null>(null);
  const { isOnline } = useOfflineSync();

  const fetchMCard = async (slug?: string) => {
    try {
      // Éviter le rechargement si c'est le même slug
      if (loadedSlugRef.current === slug && mcard) {
        console.log('Slug already loaded, skipping fetch:', slug);
        return;
      }
      
      console.log('Starting fetchMCard for slug:', slug);
      setLoading(true);
      
      // Essayer d'abord de charger depuis le cache local en mode hors ligne
      if (!isOnline && slug && slug !== 'demo') {
        console.log('Mode hors ligne, chargement depuis le cache');
        const cachedMCard = offlineStorage.getMCardBySlug(slug);
        if (cachedMCard) {
          setMCard(cachedMCard);
          setStatuses(offlineStorage.getStatuses(cachedMCard.id));
          setProducts(offlineStorage.getProducts(cachedMCard.id));
          setReviews(offlineStorage.getReviews(cachedMCard.id));
          setViewCount(cachedMCard.view_count || 0);
          loadedSlugRef.current = slug;
          setLoading(false);
          console.log('Données chargées depuis le cache');
          return;
        }
      }
      
      if (!slug) {
        console.log('No slug provided, using default card');
        const defaultCard = createDefaultCard();
        setMCard(defaultCard);
        setStatuses(createDefaultStatuses());
        setProducts(createDefaultProducts());
        setViewCount(defaultCard.view_count || 0);
        loadedSlugRef.current = null;
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
        loadedSlugRef.current = slug;
        setLoading(false);
        return;
      }

      console.log('Fetching real mCard data for slug:', slug);
      const mcardData = await fetchMCardBySlug(slug);
      
      if (!mcardData) {
        console.log('No mCard found for slug:', slug);
        setError(`Carte non trouvée pour le slug: ${slug}`);
        loadedSlugRef.current = null;
        setLoading(false);
        return;
      }

      console.log('MCard found:', mcardData);
      // Force refresh profile picture to avoid cache issues
      if (mcardData.profile_picture_url) {
        mcardData.profile_picture_url = `${mcardData.profile_picture_url}?t=${Date.now()}`;
      }
      setMCard(mcardData);
      setViewCount(mcardData.view_count || 0);
      setError(null);
      
      // Sauvegarder dans le cache local
      offlineStorage.saveMCard(mcardData);
      
      // Vérifier la propriété immédiatement
      const ownershipStatus = await checkMCardOwnership(mcardData.user_id);
      console.log('Checking ownership for MCard user_id:', mcardData.user_id);
      setIsOwner(ownershipStatus);
      console.log('Is owner result:', ownershipStatus);
      
      // Refaire la vérification après un petit délai pour s'assurer que l'auth est stable
      setTimeout(async () => {
        const secondOwnershipCheck = await checkMCardOwnership(mcardData.user_id);
        if (secondOwnershipCheck !== ownershipStatus) {
          console.log('Ownership status changed on second check:', secondOwnershipCheck);
          setIsOwner(secondOwnershipCheck);
        }
      }, 500);
      
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
        
        // Sauvegarder dans le cache local
        offlineStorage.saveStatuses(mcardData.id, statusesData);
        offlineStorage.saveProducts(mcardData.id, productsData);
        offlineStorage.saveReviews(mcardData.id, reviewsData);
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
      
      // Marquer le slug comme chargé
      loadedSlugRef.current = slug;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la carte:', error);
      setError(`Erreur lors du chargement: ${error.message}`);
      loadedSlugRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async (forceUpdate = false) => {
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
      
      // Mise à jour intelligente des données - toujours mettre à jour pour les propriétaires ou si forcé
      if (mcardData) {
        // Vérifier si les données importantes ont changé (profil, etc.)
        const profileChanged = mcardData.profile_picture_url !== mcard.profile_picture_url ||
                              mcardData.full_name !== mcard.full_name ||
                              mcardData.job_title !== mcard.job_title ||
                              mcardData.company !== mcard.company ||
                              mcardData.description !== mcard.description ||
                              mcardData.phone_number !== mcard.phone_number ||
                              mcardData.email !== mcard.email ||
                              mcardData.website_url !== mcard.website_url;
        
        const socialLinksChanged = JSON.stringify(mcardData.linkedin_url) !== JSON.stringify(mcard.linkedin_url) ||
                                 JSON.stringify(mcardData.twitter_url) !== JSON.stringify(mcard.twitter_url) ||
                                 JSON.stringify(mcardData.facebook_url) !== JSON.stringify(mcard.facebook_url) ||
                                 JSON.stringify(mcardData.instagram_url) !== JSON.stringify(mcard.instagram_url);
        
        if (profileChanged || socialLinksChanged || isOwner || forceUpdate) {
          console.log('Profile data updated, refreshing for all users');
          setMCard(mcardData);
        }
        
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

  // Fonction pour forcer le rafraîchissement immédiat (utilisée après mise à jour)
  const forceRefresh = async () => {
    await refreshData(true);
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
    forceRefresh,
    updateViewCount,
    setMCard,
    setStatuses,
    setProducts,
    setReviews,
    addStatus,
    addProduct
  };
};
