import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pin } from 'lucide-react';
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

export const PinnedProductsCarousel = ({ onImageClick }: PinnedProductsCarouselProps) => {
  const [pinnedProducts, setPinnedProducts] = useState<PinnedProductWithMCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPinnedProducts();
  }, []);

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
        .eq('mcards.subscription_status', 'active')
        .not('image_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const formattedProducts = products?.map(product => ({
        ...product,
        mcard: product.mcard as MCard
      })) || [];

      setPinnedProducts(formattedProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits épinglés:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pinnedProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + pinnedProducts.length) % pinnedProducts.length);
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

  if (pinnedProducts.length === 0) {
    return null;
  }

  const currentProduct = pinnedProducts[currentIndex];

  return (
    <div className="mb-8 px-4">
      <div className="relative bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl p-6 border border-yellow-400/30 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Pin className="h-5 w-5 text-yellow-400" />
          <h2 className="text-lg font-bold text-white">Produits épinglés</h2>
          <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-300">
            {pinnedProducts.length}
          </Badge>
        </div>

        {/* Product Card */}
        <div className="relative bg-black/40 rounded-xl overflow-hidden group">
          <div className="relative aspect-[16/9] bg-gradient-to-br from-purple-900/20 to-pink-900/20">
            <ImageWithFallback
              src={currentProduct.image_url || ''}
              alt={currentProduct.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              fallbackClassName="w-full h-full"
              onClick={() => {
                const allProducts = pinnedProducts.map(p => ({ ...p, mcard: undefined }));
                const allMCards = pinnedProducts.map(p => p.mcard);
                onImageClick?.(allProducts, allMCards, currentIndex);
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Navigation */}
            {pinnedProducts.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Progress indicators */}
            {pinnedProducts.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {pinnedProducts.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'bg-yellow-400' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Product info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="cursor-pointer"
                      onClick={() => handleProfileClick(currentProduct.mcard.slug)}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={currentProduct.mcard.profile_picture_url || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-slate-800 to-slate-900 text-white text-xs">
                          {currentProduct.mcard.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">
                        @{currentProduct.mcard.full_name?.replace(/\s+/g, '').toLowerCase()}
                      </h3>
                      {currentProduct.mcard.is_verified && (
                        <span className="text-xs text-blue-400">✓ Vérifié</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="font-semibold text-sm mb-1">{currentProduct.name}</p>
                  {currentProduct.description && (
                    <p className="text-xs opacity-80 line-clamp-2">{currentProduct.description}</p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-yellow-400/20 px-2 py-1 rounded-full">
                      #{currentProduct.category.replace(/\s+/g, '').toLowerCase()}
                    </span>
                    <span className="text-xs bg-green-500 px-2 py-1 rounded-full font-bold">
                      {currentProduct.price.toLocaleString()} {currentProduct.currency}
                    </span>
                  </div>
                </div>
                
                <div className="ml-4">
                  <MCardInteractionButtons 
                    mcardId={currentProduct.mcard.id}
                    mcardOwnerId={currentProduct.mcard.user_id}
                    mcardOwnerName={currentProduct.mcard.full_name}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};