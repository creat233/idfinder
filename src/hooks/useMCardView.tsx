
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useMCardData } from './useMCardData';
import { useMCardRealtime } from './useMCardRealtime';
import { useMCardActions } from './useMCardActions';
import { ROUTING_CONFIG } from '@/utils/routingConfig';

export const useMCardView = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const {
    mcard,
    statuses,
    products,
    reviews,
    loading,
    isOwner,
    viewCount,
    error,
    fetchMCard,
    refreshData
  } = useMCardData();

  const {
    isShareDialogOpen,
    setIsShareDialogOpen,
    showQRCode,
    setShowQRCode,
    handleCopyLink,
    handleEdit
  } = useMCardActions();

  useMCardRealtime({ mcard, slug, refreshData });

  useEffect(() => {
    // Vérifier si on a besoin de rediriger vers l'URL canonique
    const slugFromPath = ROUTING_CONFIG.extractSlugFromPath(location.pathname);
    const effectiveSlug = slug || slugFromPath;
    
    if (effectiveSlug) {
      console.log('Loading MCard with slug:', effectiveSlug);
      fetchMCard(effectiveSlug);
    } else {
      console.log('No slug found in URL, loading default');
      fetchMCard();
    }
  }, [slug, location.pathname, fetchMCard]);

  return {
    mcard,
    statuses,
    products,
    reviews,
    loading,
    error,
    isShareDialogOpen,
    setIsShareDialogOpen,
    isOwner,
    showQRCode,
    setShowQRCode,
    viewCount,
    handleCopyLink,
    handleEdit: () => handleEdit(mcard?.id),
    refreshData
  };
};
