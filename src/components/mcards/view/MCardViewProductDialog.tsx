
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MCardViewProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mcardId: string;
  onProductAdded: () => void;
}

export const MCardViewProductDialog = ({ isOpen, onOpenChange, mcardId, onProductAdded }: MCardViewProductDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Service");
  const [currency, setCurrency] = useState("FCFA");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('mcard_products')
        .insert({
          mcard_id: mcardId,
          name: name.trim(),
          description: description.trim() || null,
          price: parseFloat(price),
          category,
          currency
        });

      if (error) throw error;

      toast({
        title: "Produit ajouté !",
        description: "Votre produit a été ajouté avec succès."
      });

      setName("");
      setDescription("");
      setPrice("");
      setCategory("Service");
      setCurrency("FCFA");
      onProductAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit. Vérifiez que vous avez un plan Premium."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un produit/service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product-name">Nom du produit/service</Label>
            <Input
              id="product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Consultation, Formation, Produit..."
              required
            />
          </div>
          <div>
            <Label htmlFor="product-description">Description (optionnel)</Label>
            <Textarea
              id="product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre produit ou service..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product-price">Prix</Label>
              <Input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="product-currency">Devise</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FCFA">FCFA</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="product-category">Catégorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Produit">Produit</SelectItem>
                <SelectItem value="Formation">Formation</SelectItem>
                <SelectItem value="Consultation">Consultation</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !name.trim() || !price}>
              {loading ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
