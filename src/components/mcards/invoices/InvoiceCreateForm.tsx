import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { InvoiceCreateData } from '@/types/invoice';

const invoiceSchema = z.object({
  client_name: z.string().min(1, 'Le nom du client est requis'),
  client_email: z.string().email().optional().or(z.literal('')),
  client_phone: z.string().optional(),
  due_date: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1, 'Description requise'),
    quantity: z.number().min(1, 'Quantité minimum 1'),
    unit_price: z.number().min(0, 'Prix unitaire requis'),
  })).min(1, 'Au moins un article requis')
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceCreateFormProps {
  mcardId: string;
  onSubmit: (data: InvoiceCreateData) => Promise<void>;
  onCancel: () => void;
}

export const InvoiceCreateForm = ({ mcardId, onSubmit, onCancel }: InvoiceCreateFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      client_name: '',
      client_email: '',
      client_phone: '',
      due_date: '',
      description: '',
      notes: '',
      items: [{ description: '', quantity: 1, unit_price: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  const watchedItems = form.watch('items');
  const totalAmount = watchedItems.reduce((sum, item) => 
    sum + (item.quantity || 0) * (item.unit_price || 0), 0
  );

  const handleSubmit = async (data: InvoiceFormData) => {
    try {
      setLoading(true);
      await onSubmit({
        mcard_id: mcardId,
        client_name: data.client_name,
        client_email: data.client_email || undefined,
        client_phone: data.client_phone || undefined,
        due_date: data.due_date || undefined,
        description: data.description || undefined,
        notes: data.notes || undefined,
        items: data.items.map(item => ({
          description: item.description!,
          quantity: item.quantity!,
          unit_price: item.unit_price!
        })),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Nouvelle Facture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Informations client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Nom du client *</Label>
                <Input
                  id="client_name"
                  {...form.register('client_name')}
                  placeholder="Nom complet du client"
                />
                {form.formState.errors.client_name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.client_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_email">Email du client</Label>
                <Input
                  id="client_email"
                  type="email"
                  {...form.register('client_email')}
                  placeholder="email@exemple.com"
                />
                {form.formState.errors.client_email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.client_email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_phone">Téléphone du client</Label>
                <Input
                  id="client_phone"
                  {...form.register('client_phone')}
                  placeholder="+221 70 123 45 67"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Date d'échéance</Label>
                <Input
                  id="due_date"
                  type="date"
                  {...form.register('due_date')}
                />
              </div>
            </div>

            {/* Articles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Articles</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ description: '', quantity: 1, unit_price: 0 })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un article
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div className="md:col-span-2 space-y-2">
                        <Label>Description</Label>
                        <Input
                          {...form.register(`items.${index}.description`)}
                          placeholder="Description de l'article"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Quantité</Label>
                        <Input
                          type="number"
                          min="1"
                          {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Prix unitaire (FCFA)</Label>
                        <Input
                          type="number"
                          min="0"
                          {...form.register(`items.${index}.unit_price`, { valueAsNumber: true })}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">
                          {((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unit_price || 0)).toLocaleString()} FCFA
                        </div>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {form.formState.errors.items?.[index] && (
                      <p className="text-sm text-destructive mt-2">
                        Veuillez remplir tous les champs requis
                      </p>
                    )}
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="text-lg font-bold">
                    Total: {totalAmount.toLocaleString()} FCFA
                  </div>
                </div>
              </div>
            </div>

            {/* Description et notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Description générale de la facture"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes internes</Label>
                <Textarea
                  id="notes"
                  {...form.register('notes')}
                  placeholder="Notes privées (non visibles sur la facture)"
                  rows={3}
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer la facture'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};