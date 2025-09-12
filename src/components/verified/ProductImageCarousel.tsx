import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MCard, MCardProduct } from '@/types/mcard';
import { ChevronLeft, ChevronRight, User, Building, Phone, Mail, ExternalLink, X } from 'lucide-react';
import { URL_CONFIG } from '@/utils/urlConfig';
import { MCardComments } from './MCardComments';

interface ProductImageCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  products: MCardProduct[];
  mcards: MCard[];
  initialProductIndex: number;
}

export const ProductImageCarousel = ({ isOpen, onClose, products, mcards, initialProductIndex }: ProductImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialProductIndex);

  useEffect(() => {
    setCurrentIndex(initialProductIndex);
  }, [initialProductIndex, isOpen]);

  if (!products.length || currentIndex < 0 || currentIndex >= products.length) return null;

  const currentProduct = products[currentIndex];
  const currentMCard = mcards.find(m => m.id === currentProduct.mcard_id);

  if (!currentMCard) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0));
  };

  const handleProfileClick = () => {
    const url = URL_CONFIG.getMCardUrl(currentMCard.slug);
    window.open(url, '_blank');
    onClose();
  };

  // Gérer les touches clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] max-h-[98vh] w-full p-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[98vh]">
          {/* Section Image avec Navigation */}
          <div className="relative bg-black flex items-center justify-center min-h-[50vh] lg:min-h-full">
            {/* Image */}
            <img
              src={currentProduct.image_url || ''}
              alt={currentProduct.name}
              className="max-w-full max-h-full object-contain"
              style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
            />
            
            {/* Badge du produit */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-black/70 text-white">
                {currentProduct.category}
              </Badge>
            </div>
            
            {/* Prix */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-600 text-white font-bold text-lg">
                {currentProduct.price.toLocaleString()} {currentProduct.currency}
              </Badge>
            </div>

            {/* Navigation des images */}
            {products.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                {/* Indicateur de position */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {products.length}
                </div>
              </>
            )}

            {/* Bouton fermer */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-16 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Informations du profil et du produit */}
          <div className="p-3 sm:p-6 flex flex-col overflow-y-auto max-h-[98vh]">
            {/* Profil du propriétaire cliquable */}
            <div className="mb-6 cursor-pointer group" onClick={handleProfileClick}>
              <div className="flex items-center space-x-4 mb-4 p-3 rounded-lg border-2 border-transparent group-hover:border-blue-200 group-hover:bg-blue-50 transition-all duration-200">
                <Avatar className="h-16 w-16 ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all duration-200">
                  <AvatarImage src={currentMCard.profile_picture_url || ''} />
                  <AvatarFallback className="text-white bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 font-bold text-sm">
                    {currentMCard.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NN'}
                  </AvatarFallback>
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                    {currentMCard.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {currentMCard.full_name}
                  </h2>
                  {currentMCard.job_title && (
                    <p className="text-gray-600 font-medium">{currentMCard.job_title}</p>
                  )}
                  {currentMCard.company && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Building className="h-4 w-4" />
                      <span>{currentMCard.company}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-3 w-3" />
                    <span>Cliquez pour voir le profil complet</span>
                  </div>
                </div>
              </div>
              
              {/* Informations de contact */}
              <div className="space-y-2 mb-4">
                {currentMCard.phone_number && (
                  <div className="flex items-center gap-3 text-sm bg-green-50 rounded-lg p-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium text-green-800">{currentMCard.phone_number}</span>
                  </div>
                )}
                {currentMCard.email && (
                  <div className="flex items-center gap-3 text-sm bg-blue-50 rounded-lg p-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-blue-800">{currentMCard.email}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Informations du produit */}
            <div className="border-t pt-6 flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{currentProduct.name}</h3>
              
              {currentProduct.description && (
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{currentProduct.description}</p>
                </div>
              )}
              
              {/* Prix avec style */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Prix</p>
                    <p className="text-3xl font-bold text-green-600">
                      {currentProduct.price.toLocaleString()} {currentProduct.currency}
                    </p>
                  </div>
                  <div className="text-green-500">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Catégorie */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Catégorie:</span>
                <Badge variant="outline" className="font-semibold">
                  {currentProduct.category}
                </Badge>
              </div>
            </div>
            
            {/* Section commentaires */}
            <div className="mt-6">
              <MCardComments 
                mcardId={currentMCard.id}
                mcardOwnerName={currentMCard.full_name}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};