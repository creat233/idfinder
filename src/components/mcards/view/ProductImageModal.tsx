import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { X, ZoomIn, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductImageModalProps {
  imageUrl: string;
  product: {
    name: string;
    description?: string;
    price: number;
    currency: string;
    category: string;
  };
  children: React.ReactNode;
}

export const ProductImageModal = ({ imageUrl, product, children }: ProductImageModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          {children}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg flex items-center justify-center">
            <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-2xl mb-2">{product.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {product.category}
                  </Badge>
                  {product.description && (
                    <p className="text-gray-600 mb-4">{product.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">
                      {product.price.toLocaleString()} {product.currency}
                    </span>
                    <ShoppingCart className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 flex justify-center bg-gray-50">
              <img
                src={imageUrl}
                alt={product.name}
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};