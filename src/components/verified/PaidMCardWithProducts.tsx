import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MCard, MCardProduct } from '@/types/mcard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { MCardInteractionButtons } from '@/components/mcards/MCardInteractionButtons';
import { ImageWithFallback } from './ImageWithFallback';

interface PaidMCardWithProductsProps {
  mcard: MCard;
}

export const PaidMCardWithProducts = ({ mcard }: PaidMCardWithProductsProps) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<MCardProduct[]>([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const imageScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProducts();
  }, [mcard.id]);

  useEffect(() => {
    if (products.length > 1) {
      const interval = setInterval(() => {
        setCurrentProductIndex((prev) => (prev + 1) % products.length);
        setCurrentImageIndex(0); // Reset image index when product changes
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [products.length]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('mcard_products')
        .select('*')
        .eq('mcard_id', mcard.id)
        .eq('is_active', true)
        .not('image_url', 'is', null)
        .limit(5);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevProduct = () => {
    setCurrentProductIndex((prev) => 
      prev === 0 ? products.length - 1 : prev - 1
    );
    setCurrentImageIndex(0);
  };

  const handleNextProduct = () => {
    setCurrentProductIndex((prev) => (prev + 1) % products.length);
    setCurrentImageIndex(0);
  };

  const handleNavigateToMCard = () => {
    navigate(`/mcard/${mcard.slug}`);
  };

  // Get all images for current product
  const getCurrentProductImages = (): string[] => {
    const product = products[currentProductIndex];
    if (!product) return [];
    
    const images: string[] = [];
    if (product.image_urls && product.image_urls.length > 0) {
      images.push(...product.image_urls);
    } else if (product.image_url) {
      images.push(product.image_url);
    }
    return images;
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const images = getCurrentProductImages();
    setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const images = getCurrentProductImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  if (loading || products.length === 0) {
    return null;
  }

  const currentProduct = products[currentProductIndex];
  const productImages = getCurrentProductImages();
  const currentImageUrl = productImages[currentImageIndex] || currentProduct.image_url || '';

  return (
    <div className="relative w-full bg-slate-950 rounded-2xl overflow-hidden">
      {/* En-tête compact avec avatar et nom */}
      <div 
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={handleNavigateToMCard}
      >
        <Avatar className="h-10 w-10 border-2 border-blue-400/50">
          <AvatarImage src={mcard.profile_picture_url || ''} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-sm">
            {mcard.full_name?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        <span className="text-white/80 text-sm font-medium">
          @{mcard.slug}
        </span>
      </div>

      {/* Image du produit avec boutons sur le côté */}
      <div className="relative aspect-square bg-black">
        <ImageWithFallback
          src={currentImageUrl}
          alt={currentProduct.name}
          className="w-full h-full object-cover"
        />

        {/* Indicateurs d'images multiples */}
        {productImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {productImages.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentImageIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation images (swipe gauche/droite) */}
        {productImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-14 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors z-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Navigation produits (si plusieurs produits et une seule image) */}
        {products.length > 1 && productImages.length <= 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevProduct();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextProduct();
              }}
              className="absolute right-14 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors z-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Boutons d'interaction sur le côté droit */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          <MCardInteractionButtons
            mcardId={mcard.id}
            mcardOwnerId={mcard.user_id}
            mcardOwnerName={mcard.full_name}
          />
        </div>

        {/* Indicateur de produit (si multi-produits) */}
        {products.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
            {currentProductIndex + 1}/{products.length}
          </div>
        )}
      </div>

      {/* Informations du produit en bas */}
      <div className="p-4 space-y-2">
        <h4 className="font-bold text-white text-lg">
          {currentProduct.name}
        </h4>
        {currentProduct.description && (
          <p className="text-sm text-white/60">
            Disponible
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full">
            #{currentProduct.category.toLowerCase()}
          </span>
          <span className="text-sm font-bold text-white bg-green-500 px-3 py-1 rounded-full">
            {currentProduct.price.toLocaleString()} {currentProduct.currency}
          </span>
        </div>
      </div>
    </div>
  );
};
