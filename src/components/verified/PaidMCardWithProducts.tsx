import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MCard, MCardProduct } from '@/types/mcard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { MCardInteractionButtons } from '@/components/mcards/MCardInteractionButtons';
import { ImageWithFallback } from './ImageWithFallback';
import { MCardComments } from './MCardComments';

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
      }, 3000);
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
    <div className="relative w-full bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 mb-6">
      {/* En-tête de la carte */}
      <div 
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={handleNavigateToMCard}
      >
        <Avatar className="h-12 w-12 border-2 border-purple-400/50">
          <AvatarImage src={mcard.profile_picture_url || ''} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold">
            {mcard.full_name?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-base truncate">
            {mcard.full_name}
          </h3>
          <p className="text-sm text-white/60 truncate">
            {mcard.job_title}
            {mcard.company && ` • ${mcard.company}`}
          </p>
        </div>
      </div>

      {/* Image du produit */}
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextProduct();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicateurs de progression */}
            <div className="absolute top-2 left-0 right-0 flex gap-1 px-2">
              {products.map((_, index) => (
                <div
                  key={index}
                  className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                    index === currentProductIndex
                      ? 'bg-white'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Boutons d'interaction */}
      <div className="px-4 py-3">
        <MCardInteractionButtons
          mcardId={mcard.id}
          mcardOwnerId={mcard.user_id}
          mcardOwnerName={mcard.full_name}
        />
      </div>

      {/* Informations du produit */}
      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-lg truncate">
              {currentProduct.name}
            </h4>
            {currentProduct.description && (
              <p className="text-sm text-white/70 line-clamp-2 mt-1">
                {currentProduct.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="text-lg font-bold text-green-400">
              {currentProduct.price.toLocaleString()} {currentProduct.currency}
            </span>
            <span className="text-xs text-white/50 bg-purple-500/20 px-2 py-1 rounded">
              {currentProduct.category}
            </span>
          </div>
        </div>
      </div>

      {/* Section commentaires */}
      <div className="px-4 pb-4">
        <MCardComments mcardId={mcard.id} mcardOwnerName={mcard.full_name} />
      </div>
    </div>
  );
};
