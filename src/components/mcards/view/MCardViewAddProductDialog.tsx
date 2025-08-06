
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MCardViewAddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mcardId: string;
  onProductAdded: () => void;
  onOptimisticProductAdd?: (product: any) => void;
}

const PRODUCT_CATEGORIES = [
  'Service',
  'Produit',
  'Menu restaurant',
  'Consultation',
  'Formation',
  'Événement',
  'Autre'
];

const CURRENCIES = [
  { code: 'FCFA', symbol: 'FCFA' },
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
];

export const MCardViewAddProductDialog = ({ 
  isOpen, 
  onClose, 
  mcardId, 
  onProductAdded,
  onOptimisticProductAdd 
}: MCardViewAddProductDialogProps) => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Service');
  const [currency, setCurrency] = useState('FCFA');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImageUrl, setProductImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const uploadProductImage = async (file: File): Promise<string | null> => {
    const fileName = `${mcardId}-product-${Date.now()}.${file.name.split('.').pop()}`;
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
      let imageUrl = productImageUrl;
      
      if (productImage) {
        const uploadedUrl = await uploadProductImage(productImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Optimistic update - add immediately to UI
      const tempProduct = {
        id: `temp-${Date.now()}`,
        mcard_id: mcardId,
        name: productName.trim(),
        description: description.trim() || null,
        price: numericPrice,
        category,
        currency,
        image_url: imageUrl || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (onOptimisticProductAdd) {
        onOptimisticProductAdd(tempProduct);
      }

      const { error } = await supabase
        .from('mcard_products')
        .insert({
          mcard_id: mcardId,
          name: productName.trim(),
          description: description.trim() || null,
          price: numericPrice,
          category,
          currency,
          image_url: imageUrl || null,
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Produit ajouté !",
        description: "Votre produit/service a été publié avec succès"
      });

      onProductAdded();
      onClose();
      
      // Reset form
      setProductName('');
      setDescription('');
      setPrice('');
      setCategory('Service');
      setCurrency('FCFA');
      setProductImage(null);
      setProductImageUrl('');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
      setProductImageUrl('');
    }
  };

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

          <div>
            <Label htmlFor="productImage">Image (optionnel)</Label>
            <div className="mt-2">
              <Input
                id="productImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {productImageUrl && (
                <div className="text-sm text-gray-600">
                  Ou URL de l'image:
                  <Input
                    value={productImageUrl}
                    onChange={(e) => setProductImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
              )}
            </div>
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
