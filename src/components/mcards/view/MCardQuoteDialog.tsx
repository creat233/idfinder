import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { QuoteCreateData } from '@/types/quote';

interface MCardQuoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: QuoteCreateData) => Promise<void>;
  mcardId: string;
}

interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export const MCardQuoteDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  mcardId,
}: MCardQuoteDialogProps) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState<'FCFA' | 'EUR' | 'USD'>('FCFA');
  const [items, setItems] = useState<QuoteItem[]>([
    { description: '', quantity: 1, unit_price: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  const currencySymbols = {
    'FCFA': 'FCFA',
    'EUR': '€',
    'USD': '$'
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        mcard_id: mcardId,
        client_name: clientName,
        client_email: clientEmail || undefined,
        client_phone: clientPhone || undefined,
        valid_until: validUntil || undefined,
        description: description || undefined,
        notes: notes || undefined,
        currency: currency,
        items: items.filter(item => item.description && item.quantity > 0)
      });

      // Reset form
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setValidUntil('');
      setDescription('');
      setNotes('');
      setCurrency('FCFA');
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating quote:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un devis</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informations du client</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="clientName">Nom du client *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientPhone">Téléphone</Label>
                <Input
                  id="clientPhone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Quote Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Détails du devis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Devise *</Label>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value as 'FCFA' | 'EUR' | 'USD')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FCFA">FCFA (CFA Franc)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    <SelectItem value="USD">USD (Dollar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="validUntil">Valable jusqu'au</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Articles</h3>
              <Button type="button" onClick={handleAddItem} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-start p-4 rounded-lg border bg-card">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="col-span-3">
                      <Label>Description *</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Quantité *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Prix unitaire ({currencySymbols[currency]}) *</Label>
                      <Input
                        type="number"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Total</Label>
                      <Input
                        value={(item.quantity * item.unit_price).toLocaleString()}
                        disabled
                      />
                    </div>
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end p-4 bg-primary/5 rounded-lg">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-primary">
                  {calculateTotal().toLocaleString()} {currencySymbols[currency]}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Conditions, remarques..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer le devis'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
