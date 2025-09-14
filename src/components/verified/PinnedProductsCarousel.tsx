import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pin, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MCard, MCardProduct } from '@/types/mcard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { URL_CONFIG } from '@/utils/urlConfig';
import { MCardInteractionButtons } from '@/components/mcards/MCardInteractionButtons';
import { ImageWithFallback } from './ImageWithFallback';

interface PinnedProductWithMCard extends MCardProduct {
  mcard: MCard;
}

interface PinnedProductsCarouselProps {
  onImageClick?: (products: MCardProduct[], mcards: MCard[], productIndex: number) => void;
}

interface GroupedProduct {
  mcardId: string;
  products: PinnedProductWithMCard[];
  currentIndex: number;
  isPaused: boolean;
}

export const PinnedProductsCarousel = ({ onImageClick }: PinnedProductsCarouselProps) => {
  const [pinnedProducts, setPinnedProducts] = useState<PinnedProductWithMCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);
  const [fullscreenImage, setFullscreenImage] = useState<{ src: string; alt: string } | null>(null);
  const [globalPause, setGlobalPause] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadPinnedProducts();
  }, []);

  // Rotation automatique des images
  useEffect(() => {
    if (groupedProducts.length === 0 || globalPause) return;

    const intervals = groupedProducts.map((group, groupIndex) => {
      if (group.products.length <= 1 || group.isPaused) return null;

      return setInterval(() => {
        setGroupedProducts(prev => 
          prev.map((g, index) => 
            index === groupIndex && !g.isPaused
              ? { ...g, currentIndex: (g.currentIndex + 1) % g.products.length }
              : g
          )
        );
      }, 3000);
    });

    return () => {
      intervals.forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [groupedProducts.length, globalPause, groupedProducts.map(g => g.isPaused).join(',')]);

  // Gestion des interactions
  const pauseGroup = (groupIndex: number) => {
    setGroupedProducts(prev => 
      prev.map((g, index) => 
        index === groupIndex ? { ...g, isPaused: true } : g
      )
    );
  };

  const resumeGroup = (groupIndex: number) => {
    setGroupedProducts(prev => 
      prev.map((g, index) => 
        index === groupIndex ? { ...g, isPaused: false } : g
      )
    );
  };

  const handleLongPressStart = (groupIndex: number) => {
    longPressTimer.current = setTimeout(() => {
      pauseGroup(groupIndex);
    }, 500);
  };

  const handleLongPressEnd = (groupIndex: number) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleImageClick = (product: PinnedProductWithMCard, groupIndex: number) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      return;
    }

    setFullscreenImage({
      src: product.image_url || '',
      alt: product.name
    });
  };

  const handleMessageClick = (groupIndex: number) => {
    setGlobalPause(true);
    pauseGroup(groupIndex);
  };

  const handleMessageDialogClose = (groupIndex: number) => {
    setGlobalPause(false);
    resumeGroup(groupIndex);
  };

  const loadPinnedProducts = async () => {
    try {
      const { data: products, error } = await supabase
        .from('mcard_products')
        .select(`
          *,
          mcard:mcards!inner(*)
        `)
        .eq('is_pinned', true)
        .eq('is_active', true)
        .eq('mcards.is_published', true)
        .eq('mcards.is_verified', true)
        .not('image_url', 'is', null)
        .order('mcard_id', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedProducts = products?.map(product => ({
        ...product,
        mcard: product.mcard as MCard
      })) || [];

      // Grouper les produits par créateur
      const groupedByCreator = new Map();
      formattedProducts.forEach(product => {
        if (!groupedByCreator.has(product.mcard_id)) {
          groupedByCreator.set(product.mcard_id, []);
        }
        groupedByCreator.get(product.mcard_id).push(product);
      });

      // Créer la structure groupée
      const grouped = Array.from(groupedByCreator.entries()).map(([mcardId, products]) => ({
        mcardId,
        products,
        currentIndex: 0,
        isPaused: false
      }));

      setGroupedProducts(grouped);
      setPinnedProducts(formattedProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits épinglés:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (slug: string) => {
    const url = URL_CONFIG.getMCardUrl(slug);
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="mb-8 px-4">
        <div className="relative bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl p-6 border border-yellow-400/30">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (groupedProducts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full pt-16 snap-y snap-mandatory overflow-y-auto h-screen">
        {groupedProducts.map((group, groupIndex) => {
          const currentProduct = group.products[group.currentIndex];
          return (
          <div key={currentProduct.id} className="w-full h-screen snap-start flex items-center justify-center">
            <div className="relative w-full h-full overflow-hidden group shadow-2xl">
            {/* Image avec hauteur pleine */}
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <img
                src={currentProduct.image_url || ''}
                alt={currentProduct.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer select-none"
                onClick={() => handleImageClick(currentProduct, groupIndex)}
                onMouseDown={() => handleLongPressStart(groupIndex)}
                onMouseUp={() => handleLongPressEnd(groupIndex)}
                onMouseLeave={() => handleLongPressEnd(groupIndex)}
                onTouchStart={() => handleLongPressStart(groupIndex)}
                onTouchEnd={() => handleLongPressEnd(groupIndex)}
                onError={(e) => {
                  console.error('Image failed to load:', currentProduct.image_url);
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="100%25" height="100%25" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280"%3EImage indisponible%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>

            {/* Overlay gradient - fixé au container */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 pointer-events-none" />

            {/* Profil créateur - Style Instagram Stories */}
            <div className="absolute top-4 left-4 z-20">
              <div 
                className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-full p-2 cursor-pointer hover:bg-black/40 transition-all duration-200"
                onClick={() => handleProfileClick(currentProduct.mcard.slug)}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10 border-2 border-white/80 ring-2 ring-gradient-to-r from-pink-500 to-yellow-500">
                    <AvatarImage src={currentProduct.mcard.profile_picture_url || ''} />
                    <AvatarFallback className="text-white bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 font-bold text-sm">
                      {currentProduct.mcard.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NN'}
                    </AvatarFallback>
                  </Avatar>
                  {currentProduct.mcard.is_verified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}
                </div>
                <div className="text-white">
                  <h3 className="font-semibold text-sm drop-shadow-lg">
                    @{currentProduct.mcard.slug}
                  </h3>
                </div>
              </div>
            </div>

            {/* Boutons d'interaction en haut à droite */}
            <div 
              className="absolute top-4 right-4 z-20"
              onMouseDown={() => handleMessageClick(groupIndex)}
              onTouchStart={() => handleMessageClick(groupIndex)}
            >
              <MCardInteractionButtons 
                mcardId={currentProduct.mcard.id}
                mcardOwnerId={currentProduct.mcard.user_id}
                mcardOwnerName={currentProduct.mcard.full_name}
              />
            </div>

            {/* Informations produit en bas */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
              <div className="space-y-2">
                <h2 className="font-bold text-xl drop-shadow-lg">{currentProduct.name}</h2>
                {currentProduct.description && (
                  <p className="text-sm opacity-90 line-clamp-2 drop-shadow-lg">{currentProduct.description}</p>
                )}
                
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    #{currentProduct.category.replace(/\s+/g, '').toLowerCase()}
                  </span>
                  <span className="text-base bg-green-500 px-3 py-2 rounded-full font-bold">
                    {currentProduct.price.toLocaleString()} {currentProduct.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      })}
    </div>

    {/* Modal plein écran pour les images */}
    {fullscreenImage && (
      <div 
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
        onClick={() => setFullscreenImage(null)}
      >
        <button
          className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
          onClick={() => setFullscreenImage(null)}
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={fullscreenImage.src}
          alt={fullscreenImage.alt}
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )}
  </>
  );
};