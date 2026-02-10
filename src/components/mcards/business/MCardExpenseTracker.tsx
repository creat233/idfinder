import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Receipt, Plus, Trash2, TrendingDown, PieChart } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MCardExpenseTrackerProps {
  mcardId: string;
}

export const MCardExpenseTracker = ({ mcardId }: MCardExpenseTrackerProps) => {
  const { expenses, stats, loading, addExpense, deleteExpense, categories } = useExpenses(mcardId);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', category: 'Autre', expense_date: new Date().toISOString().split('T')[0], currency: 'FCFA' });

  const handleSubmit = async () => {
    if (!form.description || !form.amount) return;
    await addExpense({ ...form, amount: parseFloat(form.amount) });
    setForm({ description: '', amount: '', category: 'Autre', expense_date: new Date().toISOString().split('T')[0], currency: 'FCFA' });
    setIsOpen(false);
  };

  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

  return (
    <Card className="border shadow-sm" data-expense-tracker>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-red-600" />
            Suivi des Dépenses
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" /> Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nouvelle dépense</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                <Input type="number" placeholder="Montant" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="date" value={form.expense_date} onChange={e => setForm(f => ({ ...f, expense_date: e.target.value }))} />
                <Button onClick={handleSubmit} className="w-full">Enregistrer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <TrendingDown className="h-4 w-4 text-red-600 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Ce mois</p>
            <p className="font-bold text-sm text-red-700">{fmt(stats.monthlyExpenses)}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <PieChart className="h-4 w-4 text-orange-600 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Top catégorie</p>
            <p className="font-bold text-sm text-orange-700">{stats.topCategory || 'N/A'}</p>
          </div>
        </div>

        {/* Category breakdown */}
        {Object.keys(stats.byCategory).length > 0 && (
          <div className="space-y-1.5">
            {Object.entries(stats.byCategory)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([cat, amount]) => (
                <div key={cat} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{cat}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (amount / stats.totalExpenses) * 100)}%` }} />
                    </div>
                    <span className="font-medium w-20 text-right">{fmt(amount)}</span>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Recent expenses */}
        <ScrollArea className="max-h-40">
          <div className="space-y-1.5">
            {expenses.slice(0, 8).map(e => (
              <div key={e.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{e.description}</p>
                  <div className="flex gap-1.5 items-center text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] px-1 py-0">{e.category}</Badge>
                    <span>{format(new Date(e.expense_date), 'dd MMM', { locale: fr })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-red-600">{fmt(Number(e.amount))}</span>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => deleteExpense(e.id)}>
                    <Trash2 className="h-3 w-3 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
