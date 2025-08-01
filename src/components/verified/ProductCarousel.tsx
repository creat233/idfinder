import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MCard, MCardProduct } from '@/types/mcard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { URL_CONFIG } from '@/utils/urlConfig';
import { MCardInteractionButtons } from '@/components/mcards/MCardInteractionButtons';

interface MCardWithProducts extends MCard {
  products: MCardProduct[];
}

interface ProductCarouselProps {
  onImageClick?: (product: MCardProduct, mcard: MCard) => void;
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
    <div className="mb-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          🛍️ Produits & Services
        </h2>
        <div className="text-sm text-gray-500">
          {filteredMCards.length} professionnels
        </div>
      </div>
      
      {/* Grille responsive sans scroll */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div key={mcard.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-100 animate-fade-in hover-scale">
            {/* Section Image du produit - Format carré pour une meilleure visibilité */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={currentProduct.image_url || ''}
                alt={currentProduct.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                onClick={() => onImageClick?.(currentProduct, mcard)}
                loading="lazy"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Navigation des produits */}
              {filteredProducts.length > 1 && (
                <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/80 hover:bg-white shadow-lg rounded-full p-2 h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevProduct(mcard.id, filteredProducts.length);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/80 hover:bg-white shadow-lg rounded-full p-2 h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextProduct(mcard.id, filteredProducts.length);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {/* Indicateurs de pagination */}
              {filteredProducts.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {filteredProducts.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        index === adjustedIndex ? 'bg-white shadow-lg' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Badge du produit */}
              <div className="absolute top-3 left-3">
                <Badge className="bg-black/70 text-white text-xs">
                  {currentProduct.category}
                </Badge>
              </div>
              
              {/* Prix */}
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-600 text-white font-bold">
                  {currentProduct.price.toLocaleString()} {currentProduct.currency}
                </Badge>
              </div>
            </div>
            
            {/* Section profil du propriétaire */}
            <div className="p-4 pb-2">
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
                onClick={() => handleProfileClick(mcard.slug)}
              >
                <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                  <AvatarImage src={mcard.profile_picture_url || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {mcard.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {mcard.full_name}
                  </h3>
                  {mcard.job_title && (
                    <p className="text-sm text-gray-600 truncate">{mcard.job_title}</p>
                  )}
                  {mcard.company && (
                    <p className="text-xs text-gray-500 truncate">{mcard.company}</p>
                  )}
                </div>
                
                <div className="flex-shrink-0">
                  {mcard.is_verified && (
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-1">
                      ✓ Vérifié
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Info produit */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 text-sm truncate">{currentProduct.name}</h4>
                {currentProduct.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{currentProduct.description}</p>
                )}
              </div>
            </div>
            
            {/* Boutons d'interaction */}
            <div className="px-4 pb-4">
              <div className="flex justify-end items-center space-x-2">
                <MCardInteractionButtons 
                  mcardId={mcard.id}
                  mcardOwnerId={mcard.user_id}
                  mcardOwnerName={mcard.full_name}
                  className="bg-white/90 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        );
      })}
        </div>
      </div>
    </div>
  );
};