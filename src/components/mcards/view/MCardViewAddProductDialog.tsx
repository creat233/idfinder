
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createProductNotification } from '@/services/mcardNotificationService';
import { X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface MCardViewAddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mcardId: string;
  mcardPlan?: string;
  onProductAdded: () => void;
  onOptimisticProductAdd?: (product: any) => void;
}

const PRODUCT_CATEGORIES = [
  'Service',
  'Produit',
  'Article',
  'Menu restaurant',
  'Consultation',
  'Formation',
  'Événement',
  'Offre d\'emploi',
  'Santé et beauté',
  'Location',
  'Autre'
];

const CURRENCIES = [
  { code: 'FCFA', symbol: 'FCFA' },
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
];

const getMaxImages = (plan: string): number => {
  return plan === 'free' ? 3 : 6;
};

export const MCardViewAddProductDialog = ({ 
  isOpen, 
  onClose, 
  mcardId, 
  mcardPlan = 'free',
  onProductAdded,
  onOptimisticProductAdd 
}: MCardViewAddProductDialogProps) => {
  const maxImages = getMaxImages(mcardPlan);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Service');
  const [currency, setCurrency] = useState('FCFA');
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const uploadProductImage = async (file: File): Promise<string | null> => {
    const fileName = `${mcardId}-product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`;
    const filePath = `product-images/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading product image:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const remainingSlots = maxImages - productImages.length;
      
      if (newFiles.length > remainingSlots) {
        toast({
          variant: "destructive",
          title: "Limite atteinte",
          description: `Vous ne pouvez ajouter que ${remainingSlots} image(s) supplémentaire(s)`
        });
      }
      
      const filesToAdd = newFiles.slice(0, remainingSlots);
      setProductImages(prev => [...prev, ...filesToAdd]);
    }
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= productImages.length - 1 && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const scrollToImage = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 100;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName.trim() || !price.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom et le prix sont requis"
      });
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le prix doit être un nombre valide"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Vérifier si le produit existe déjà (éviter les doublons)
      const { data: existingProducts } = await supabase
        .from('mcard_products')
        .select('id, name')
        .eq('mcard_id', mcardId)
        .ilike('name', productName.trim());

      if (existingProducts && existingProducts.length > 0) {
        toast({
          variant: "destructive",
          title: "Produit existant",
          description: "Un produit avec ce nom existe déjà"
        });
        setIsSubmitting(false);
        return;
      }

      // Upload toutes les images
      const uploadedUrls: string[] = [];
      for (const file of productImages) {
        const uploadedUrl = await uploadProductImage(file);
        if (uploadedUrl) {
          uploadedUrls.push(uploadedUrl);
        }
      }

      const mainImageUrl = uploadedUrls[0] || null;

      const { error } = await supabase
        .from('mcard_products')
        .insert({
          mcard_id: mcardId,
          name: productName.trim(),
          description: description.trim() || null,
          price: numericPrice,
          category,
          currency,
          image_url: mainImageUrl,
          image_urls: uploadedUrls.length > 0 ? uploadedUrls : []
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Produit ajouté !",
        description: "Votre produit/service a été publié avec succès"
      });

      // Get MCard info for notification
      const { data: mcardData } = await supabase
        .from('mcards')
        .select('full_name')
        .eq('id', mcardId)
        .single();

      if (mcardData) {
        await createProductNotification(mcardId, mcardData.full_name, productName.trim());
      }

      onProductAdded();
      onClose();
      
      // Reset form
      setProductName('');
      setDescription('');
      setPrice('');
      setCategory('Service');
      setCurrency('FCFA');
      setProductImages([]);
      setImageUrls([]);
      setCurrentImageIndex(0);
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const imagePreviews = productImages.map(file => URL.createObjectURL(file));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un produit/service</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productName">Nom du produit/service *</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ex: Consultation, Formation..."
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre produit ou service..."
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prix *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="currency">Devise</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Multi-image upload section */}
          <div>
            <Label>Images ({productImages.length}/{maxImages})</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Ajoutez jusqu'à {maxImages} images. Glissez pour naviguer.
            </p>
            
            {imagePreviews.length > 0 && (
              <div className="relative mb-3">
                <div 
                  ref={scrollContainerRef}
                  className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {imagePreviews.map((preview, index) => (
                    <div 
                      key={index}
                      className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
                
                {imagePreviews.length > 3 && (
                  <div className="flex justify-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => scrollToImage('left')}
                      className="p-1 bg-muted rounded-full hover:bg-muted/80"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToImage('right')}
                      className="p-1 bg-muted rounded-full hover:bg-muted/80"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {productImages.length < maxImages && (
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Plus className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Ajouter {productImages.length === 0 ? 'des images' : 'plus d\'images'}
                </span>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ajout...' : 'Ajouter le produit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
