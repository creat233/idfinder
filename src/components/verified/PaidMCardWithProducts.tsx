import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [mcard.id]);

  useEffect(() => {
    if (products.length > 1) {
      const interval = setInterval(() => {
        setCurrentProductIndex((prev) => (prev + 1) % products.length);
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
  };

  const handleNextProduct = () => {
    setCurrentProductIndex((prev) => (prev + 1) % products.length);
  };

  const handleNavigateToMCard = () => {
    navigate(`/mcard/${mcard.slug}`);
  };

  if (loading || products.length === 0) {
    return null;
  }

  const currentProduct = products[currentProductIndex];

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
          src={currentProduct.image_url || ''}
          alt={currentProduct.name}
          className="w-full h-full object-cover"
        />

        {/* Contrôles de navigation */}
        {products.length > 1 && (
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
