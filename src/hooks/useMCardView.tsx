
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

  useEffect(() => {
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

    fetchMCard();
  }, [slug]);

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
    handleEdit
  };
};
