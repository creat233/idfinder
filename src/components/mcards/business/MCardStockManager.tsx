import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, AlertTriangle, Edit2, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  stock_quantity: number | null;
  low_stock_threshold: number;
  is_active: boolean;
  price: number;
  currency: string;
}

interface MCardStockManagerProps {
  mcardId: string;
}

export const MCardStockManager = ({ mcardId }: MCardStockManagerProps) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState('');
  const [editThreshold, setEditThreshold] = useState('');

  useEffect(() => { loadProducts(); }, [mcardId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mcard_products')
        .select('id, name, stock_quantity, low_stock_threshold, is_active, price, currency')
        .eq('mcard_id', mcardId)
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      setProducts((data || []) as Product[]);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditQty(p.stock_quantity?.toString() || '');
    setEditThreshold(p.low_stock_threshold?.toString() || '5');
  };

  const saveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mcard_products')
        .update({
          stock_quantity: editQty ? parseInt(editQty) : null,
          low_stock_threshold: parseInt(editThreshold) || 5
        })
        .eq('id', id);
      if (error) throw error;
      toast({ title: "Stock mis à jour" });
      setEditingId(null);
      await loadProducts();
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const lowStockProducts = products.filter(p => p.stock_quantity !== null && p.stock_quantity <= p.low_stock_threshold);
  const outOfStockProducts = products.filter(p => p.stock_quantity !== null && p.stock_quantity === 0);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-purple-600" />
            Gestion des Stocks
          </div>
          {lowStockProducts.length > 0 && (
            <Badge variant="destructive" className="text-[10px]">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {lowStockProducts.length} bas
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Alerts */}
        {outOfStockProducts.length > 0 && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-medium text-red-800 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Rupture de stock
            </p>
            <p className="text-[10px] text-red-600 mt-1">
              {outOfStockProducts.map(p => p.name).join(', ')}
            </p>
          </div>
        )}

        {lowStockProducts.length > 0 && outOfStockProducts.length === 0 && (
          <div className="p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-medium text-yellow-800 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Stock bas
            </p>
            <p className="text-[10px] text-yellow-600 mt-1">
              {lowStockProducts.map(p => `${p.name} (${p.stock_quantity})`).join(', ')}
            </p>
          </div>
        )}

        {/* Product list */}
        <ScrollArea className="max-h-52">
          <div className="space-y-1.5">
            {products.map(p => (
              <div key={p.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                {editingId === p.id ? (
                  <>
                    <span className="font-medium truncate flex-1">{p.name}</span>
                    <div className="flex items-center gap-1">
                      <Input type="number" value={editQty} onChange={e => setEditQty(e.target.value)} className="h-6 w-14 text-xs" placeholder="Qté" />
                      <Input type="number" value={editThreshold} onChange={e => setEditThreshold(e.target.value)} className="h-6 w-12 text-xs" placeholder="Min" />
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => saveEdit(p.id)}>
                        <Check className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setEditingId(null)}>
                        <X className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={
                        p.stock_quantity === null ? 'outline' :
                        p.stock_quantity === 0 ? 'destructive' :
                        p.stock_quantity <= p.low_stock_threshold ? 'secondary' : 'default'
                      } className="text-[10px]">
                        {p.stock_quantity === null ? '∞' : p.stock_quantity}
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => startEdit(p)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {products.length === 0 && !loading && (
              <p className="text-center text-xs text-muted-foreground py-4">Aucun produit</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
