
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMCardData } from './useMCardData';
import { useMCardRealtime } from './useMCardRealtime';
import { useMCardActions } from './useMCardActions';

export const useMCardView = () => {
  const { slug } = useParams<{ slug: string }>();
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
    fetchMCard(slug);
  }, [slug]);

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
