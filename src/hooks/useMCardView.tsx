
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { MCard, MCardStatus, MCardProduct } from '@/types/mcard';
import { createDefaultCard, createDefaultStatuses } from '@/utils/mcardDefaults';
import { 
  fetchMCardBySlug, 
  fetchMCardStatuses, 
  fetchMCardProducts, 
  incrementViewCount, 
  checkMCardOwnership 
} from '@/services/mcardViewService';
import { supabase } from '@/integrations/supabase/client';

export const useMCardView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mcard, setMCard] = useState<MCard | null>(null);
  const [statuses, setStatuses] = useState<MCardStatus[]>([]);
  const [products, setProducts] = useState<MCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  const fetchMCard = async () => {
    try {
      if (!slug || slug === 'demo') {
        const defaultCard = createDefaultCard();
        setMCard(defaultCard);
        setStatuses(createDefaultStatuses());
        setViewCount(defaultCard.view_count || 0);
        setLoading(false);
        return;
      }

      const mcardData = await fetchMCardBySlug(slug);
      
      if (!mcardData) {
        const defaultCard = createDefaultCard();
        setMCard(defaultCard);
        setStatuses(createDefaultStatuses());
        setViewCount(defaultCard.view_count || 0);
      } else {
        setMCard(mcardData);
        setViewCount(mcardData.view_count || 0);
        
        // Charger les statuts et produits en parallèle
        const [statusesData, productsData] = await Promise.all([
          fetchMCardStatuses(mcardData.id),
          fetchMCardProducts(mcardData.id)
        ]);
        
        setStatuses(statusesData);
        setProducts(productsData);
        
        // Incrémenter le compteur de vues
        const newViewCount = await incrementViewCount(slug, mcardData.view_count || 0);
        setViewCount(newViewCount);
        
        // Vérifier si l'utilisateur est le propriétaire
        const ownershipStatus = await checkMCardOwnership(mcardData.user_id);
        setIsOwner(ownershipStatus);
      }
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la carte:', error);
      const defaultCard = createDefaultCard();
      setMCard(defaultCard);
      setStatuses(createDefaultStatuses());
      setViewCount(defaultCard.view_count || 0);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (!mcard || !slug || slug === 'demo') return;
    
    try {
      const [statusesData, productsData] = await Promise.all([
        fetchMCardStatuses(mcard.id),
        fetchMCardProducts(mcard.id)
      ]);
      
      setStatuses(statusesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    }
  };

  useEffect(() => {
    fetchMCard();
  }, [slug]);

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!mcard || slug === 'demo') return;

    const statusesChannel = supabase
      .channel('mcard-statuses-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mcard_statuses',
        filter: `mcard_id=eq.${mcard.id}`
      }, () => {
        refreshData();
      })
      .subscribe();

    const productsChannel = supabase
      .channel('mcard-products-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mcard_products',
        filter: `mcard_id=eq.${mcard.id}`
      }, () => {
        refreshData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(statusesChannel);
      supabase.removeChannel(productsChannel);
    };
  }, [mcard]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Lien copié !",
      description: "Le lien de votre mCard a été copié dans le presse-papiers"
    });
  };

  const handleEdit = () => {
    navigate('/mcards', { state: { editMCardId: mcard?.id } });
  };

  return {
    mcard,
    statuses,
    products,
    loading,
    isShareDialogOpen,
    setIsShareDialogOpen,
    isOwner,
    showQRCode,
    setShowQRCode,
    viewCount,
    handleCopyLink,
    handleEdit,
    refreshData
  };
};
