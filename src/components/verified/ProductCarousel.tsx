import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MCard, MCardProduct } from '@/types/mcard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { URL_CONFIG } from '@/utils/urlConfig';
import { MCardInteractionButtons } from '@/components/mcards/MCardInteractionButtons';
import { ImageWithFallback } from './ImageWithFallback';
import { MCardComments } from './MCardComments';

interface MCardWithProducts extends MCard {
  products: MCardProduct[];
}

interface ProductCarouselProps {
  onImageClick?: (products: MCardProduct[], mcards: MCard[], productIndex: number) => void;
  selectedCategory?: string;
}

export const ProductCarousel = ({ onImageClick, selectedCategory = "all" }: ProductCarouselProps) => {
  const [mcards, setMCards] = useState<MCardWithProducts[]>([]);
  const [currentProductIndex, setCurrentProductIndex] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMCardsWithProducts();
  }, []);

  useEffect(() => {
    // Auto-slide pour chaque carte toutes les 3 secondes
    const intervals: { [key: string]: NodeJS.Timeout } = {};
    
    mcards.forEach(mcard => {
      if (mcard.products.length > 1) {
        intervals[mcard.id] = setInterval(() => {
          setCurrentProductIndex(prev => ({
            ...prev,
            [mcard.id]: ((prev[mcard.id] || 0) + 1) % mcard.products.length
          }));
        }, 3000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [mcards]);

  const loadMCardsWithProducts = async () => {
    try {
      // Charger les cartes vérifiées
      const { data: mcardsData, error: mcardsError } = await supabase
        .from('mcards')
        .select('*')
        .eq('is_published', true)
        .eq('is_verified', true)
        .eq('subscription_status', 'active')
        .order('view_count', { ascending: false })
        .limit(12);

      if (mcardsError) throw mcardsError;

      if (!mcardsData || mcardsData.length === 0) {
        setLoading(false);
        return;
      }

      // Charger les produits pour chaque carte
      const mcardsWithProducts = await Promise.all(
        mcardsData.map(async (mcard) => {
          const { data: products } = await supabase
            .from('mcard_products')
            .select('*')
            .eq('mcard_id', mcard.id)
            .eq('is_active', true)
            .not('image_url', 'is', null)
            .limit(5);

          return {
            ...mcard,
            products: products || []
          };
        })
      );

      // Filtrer seulement les cartes qui ont des produits avec images
      const mcardsWithValidProducts = mcardsWithProducts.filter(mcard => mcard.products.length > 0);
      
      setMCards(mcardsWithValidProducts);
      
      // Initialiser les index des produits
      const initialIndexes: { [key: string]: number } = {};
      mcardsWithValidProducts.forEach(mcard => {
        initialIndexes[mcard.id] = 0;
      });
      setCurrentProductIndex(initialIndexes);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevProduct = (mcardId: string, productCount: number) => {
    setCurrentProductIndex(prev => ({
      ...prev,
      [mcardId]: prev[mcardId] === 0 ? productCount - 1 : prev[mcardId] - 1
    }));
  };

  const handleNextProduct = (mcardId: string, productCount: number) => {
    setCurrentProductIndex(prev => ({
      ...prev,
      [mcardId]: (prev[mcardId] + 1) % productCount
    }));
  };

  const handleProfileClick = (slug: string) => {
    const url = URL_CONFIG.getMCardUrl(slug);
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Filtrer les cartes selon la catégorie sélectionnée
  const filteredMCards = selectedCategory === "all" 
    ? mcards 
    : mcards.filter(mcard => 
        mcard.products.some(product => product.category === selectedCategory)
      );

  if (filteredMCards.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">
          {selectedCategory === "all" 
            ? "Aucun produit disponible pour le moment" 
            : `Aucun produit dans la catégorie "${selectedCategory}"`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="px-4">
      {/* Feed vertical style TikTok */}
      <div className="max-w-md mx-auto space-y-6">
        {filteredMCards.map((mcard) => {
        // Filtrer les produits selon la catégorie pour cette carte
        const filteredProducts = selectedCategory === "all" 
          ? mcard.products 
          : mcard.products.filter(product => product.category === selectedCategory);
        
        if (filteredProducts.length === 0) return null;
        
        // Utiliser les produits filtrés pour l'affichage
        const currentIndex = currentProductIndex[mcard.id] || 0;
        const adjustedIndex = Math.min(currentIndex, filteredProducts.length - 1);
        const currentProduct = filteredProducts[adjustedIndex];
        return (
          <div key={mcard.id} className="relative bg-black rounded-2xl overflow-hidden group shadow-2xl border border-white/10">
            {/* Vidéo/Image principale style TikTok avec affichage complet */}
            <div className="relative aspect-[9/16] bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center p-2">
              <ImageWithFallback
                src={currentProduct.image_url || ''}
                alt={currentProduct.name}
                className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105 cursor-pointer rounded-lg"
                fallbackClassName="w-full h-full rounded-lg"
                onClick={() => {
                  const allProducts = filteredMCards.flatMap(m =>
                    selectedCategory === "all" ? m.products : m.products.filter(p => p.category === selectedCategory)
                  );
                  const allMCards = filteredMCards.flatMap(m => 
                    (selectedCategory === "all" ? m.products : m.products.filter(p => p.category === selectedCategory))
                    .map(() => m)
                  );
                  const globalIndex = allProducts.findIndex(p => p.id === currentProduct.id);
                  onImageClick?.(allProducts, allMCards, globalIndex);
                }}
              />
              
              {/* Overlay gradients style TikTok */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20" />
              
              {/* Navigation produits (discrète) */}
              {filteredProducts.length > 1 && (
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col space-y-2">
                    <button
                      className="w-8 h-8 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevProduct(mcard.id, filteredProducts.length);
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      className="w-8 h-8 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextProduct(mcard.id, filteredProducts.length);
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Progress indicators */}
              {filteredProducts.length > 1 && (
                <div className="absolute top-4 left-4 right-16 flex space-x-1">
                  {filteredProducts.map((_, index) => (
                    <div
                      key={index}
                      className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                        index === adjustedIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Side action buttons (style TikTok) */}
              <div className="absolute bottom-20 right-3 flex flex-col space-y-4">
                {/* Avatar profil */}
                <div 
                  className="relative cursor-pointer group/avatar"
                  onClick={() => handleProfileClick(mcard.slug)}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 p-0.5">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={mcard.profile_picture_url || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-slate-800 to-slate-900 text-white text-sm">
                        {mcard.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {mcard.is_verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                
                 <div className="space-y-4">
                   <MCardInteractionButtons 
                     mcardId={mcard.id}
                     mcardOwnerId={mcard.user_id}
                     mcardOwnerName={mcard.full_name}
                   />
                 </div>
              </div>
              
              {/* Info overlay en bas */}
              <div className="absolute bottom-0 left-0 right-16 p-4 text-white">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg leading-tight">
                    @{mcard.full_name?.replace(/\s+/g, '').toLowerCase()}
                  </h3>
                  <p className="text-sm opacity-90 leading-tight">
                    {currentProduct.name}
                  </p>
                  {currentProduct.description && (
                    <p className="text-xs opacity-80 line-clamp-2 leading-tight">
                      {currentProduct.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs bg-white/20 backdrop-blur-xl px-2 py-1 rounded-full">
                      #{currentProduct.category.replace(/\s+/g, '').toLowerCase()}
                    </span>
                    <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-1 rounded-full font-bold">
                      {currentProduct.price.toLocaleString()} {currentProduct.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section commentaires */}
            <div className="mt-4">
              <MCardComments 
                mcardId={mcard.id}
                mcardOwnerName={mcard.full_name}
                className="w-full"
              />
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};