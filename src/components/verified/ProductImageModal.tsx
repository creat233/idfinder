import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MCard, MCardProduct } from '@/types/mcard';
import { User, Building, Phone, Mail, ExternalLink } from 'lucide-react';
import { URL_CONFIG } from '@/utils/urlConfig';

interface ProductImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MCardProduct | null;
  mcard: MCard | null;
}

export const ProductImageModal = ({ isOpen, onClose, product, mcard }: ProductImageModalProps) => {
  if (!product || !mcard) return null;

  const handleProfileClick = () => {
    const url = URL_CONFIG.getMCardUrl(mcard.slug);
    window.open(url, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] max-h-[98vh] w-full p-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[98vh]">
          {/* Image du produit - Responsive et adaptative */}
          <div className="relative bg-black flex items-center justify-center min-h-[50vh] lg:min-h-full">
            <img
              src={product.image_url || ''}
              alt={product.name}
              className="w-full h-full object-contain max-w-full max-h-full"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
            
            {/* Badge du produit */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-black/70 text-white">
                {product.category}
              </Badge>
            </div>
            
            {/* Prix */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-600 text-white font-bold text-lg">
                {product.price.toLocaleString()} {product.currency}
              </Badge>
            </div>
          </div>
          
          {/* Informations du profil et du produit */}
          <div className="p-3 sm:p-6 flex flex-col overflow-y-auto max-h-[98vh]">
            {/* Profil du propriétaire */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16 ring-2 ring-blue-100">
                  <AvatarImage src={mcard.profile_picture_url || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                    {mcard.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{mcard.full_name}</h2>
                  {mcard.job_title && (
                    <p className="text-gray-600 font-medium">{mcard.job_title}</p>
                  )}
                  {mcard.company && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Building className="h-4 w-4" />
                      <span>{mcard.company}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Informations de contact */}
              <div className="space-y-2 mb-4">
                {mcard.phone_number && (
                  <div className="flex items-center gap-3 text-sm bg-green-50 rounded-lg p-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium text-green-800">{mcard.phone_number}</span>
                  </div>
                )}
                {mcard.email && (
                  <div className="flex items-center gap-3 text-sm bg-blue-50 rounded-lg p-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-blue-800">{mcard.email}</span>
                  </div>
                )}
              </div>
              
              {/* Bouton vers le profil */}
              <Button 
                onClick={handleProfileClick}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Voir le profil complet
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            {/* Informations du produit */}
            <div className="border-t pt-6 flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h3>
              
              {product.description && (
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}
              
              {/* Prix avec style */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Prix</p>
                    <p className="text-3xl font-bold text-green-600">
                      {product.price.toLocaleString()} {product.currency}
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
                  {product.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};