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
        .not('image_url', 'is', null)
        .order('mcard_id', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedProducts = products?.map(product => ({
        ...product,
        mcard: product.mcard as MCard
      })) || [];

      // Grouper les produits par créateur et prendre un produit par créateur
      const uniqueCreators = new Map();
      formattedProducts.forEach(product => {
        if (!uniqueCreators.has(product.mcard_id)) {
          uniqueCreators.set(product.mcard_id, product);
        }
      });

      setPinnedProducts(Array.from(uniqueCreators.values()));
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

  if (pinnedProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-0">
      {pinnedProducts.map((product, index) => (
        <div key={product.id} className="w-full">
          <div className="relative w-full overflow-hidden group">
            {/* Image avec hauteur adaptative */}
            <div className="relative w-full min-h-[300px] max-h-[80vh] flex items-center justify-center bg-black/20">
              <img
                src={product.image_url || ''}
                alt={product.name}
                className="w-full h-auto max-h-[80vh] object-contain transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                onClick={() => {
                  const allProducts = pinnedProducts.map(p => ({ ...p, mcard: undefined }));
                  const allMCards = pinnedProducts.map(p => p.mcard);
                  onImageClick?.(allProducts, allMCards, index);
                }}
                onError={(e) => {
                  console.error('Image failed to load:', product.image_url);
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="100%25" height="100%25" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280"%3EImage indisponible%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>

            {/* Overlay gradient - fixé au container */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 pointer-events-none" />

            {/* Profil en haut à gauche - fixé au container */}
            <div className="absolute top-2 left-4 right-4 z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleProfileClick(product.mcard.slug)}
                  >
                    <Avatar className="w-12 h-12 border-2 border-white/30">
                      <AvatarImage src={product.mcard.profile_picture_url || ''} />
                      <AvatarFallback className="text-white bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 font-bold text-lg">
                        {product.mcard.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NN'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white drop-shadow-lg">
                      @{product.mcard.slug}
                    </h3>
                    <p className="text-sm text-gray-200 drop-shadow-lg">{product.mcard.full_name}</p>
                    {product.mcard.is_verified && (
                      <span className="text-sm text-blue-400 flex items-center gap-1 drop-shadow-lg">
                        <span>✓</span> Vérifié
                      </span>
                    )}
                  </div>
                </div>
                
                <MCardInteractionButtons 
                  mcardId={product.mcard.id}
                  mcardOwnerId={product.mcard.user_id}
                  mcardOwnerName={product.mcard.full_name}
                />
              </div>
            </div>

            {/* Informations produit en bas */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
              <div className="space-y-2">
                <h2 className="font-bold text-xl drop-shadow-lg">{product.name}</h2>
                {product.description && (
                  <p className="text-sm opacity-90 line-clamp-2 drop-shadow-lg">{product.description}</p>
                )}
                
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    #{product.category.replace(/\s+/g, '').toLowerCase()}
                  </span>
                  <span className="text-base bg-green-500 px-3 py-2 rounded-full font-bold">
                    {product.price.toLocaleString()} {product.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};