import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Expense {
  id: string;
  mcard_id: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  expense_date: string;
  receipt_url?: string;
  created_at: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  monthlyExpenses: number;
  topCategory: string;
  byCategory: Record<string, number>;
}

const EXPENSE_CATEGORIES = [
  'Fournitures', 'Transport', 'Marketing', 'Loyer', 'Salaires',
  'Équipement', 'Services', 'Alimentation', 'Télécom', 'Autre'
];

export const useExpenses = (mcardId: string) => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats>({
    totalExpenses: 0, monthlyExpenses: 0, topCategory: '', byCategory: {}
  });
  const [loading, setLoading] = useState(true);

  const loadExpenses = useCallback(async () => {
    if (!mcardId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mcard_expenses')
        .select('*')
        .eq('mcard_id', mcardId)
        .order('expense_date', { ascending: false });

      if (error) throw error;

      const expenseList = (data || []) as Expense[];
      setExpenses(expenseList);

      // Calculate stats
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const total = expenseList.reduce((s, e) => s + Number(e.amount), 0);
      const monthly = expenseList
        .filter(e => new Date(e.expense_date) >= monthStart)
        .reduce((s, e) => s + Number(e.amount), 0);

      const byCategory: Record<string, number> = {};
      expenseList.forEach(e => {
        byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
      });

      const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

      setStats({ totalExpenses: total, monthlyExpenses: monthly, topCategory, byCategory });
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  }, [mcardId]);

  useEffect(() => { loadExpenses(); }, [loadExpenses]);

  const addExpense = async (expense: Omit<Expense, 'id' | 'mcard_id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('mcard_expenses')
        .insert({ ...expense, mcard_id: mcardId });
      if (error) throw error;
      toast({ title: "Dépense ajoutée", description: `${expense.description} - ${Number(expense.amount).toLocaleString()} FCFA` });
      await loadExpenses();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'ajouter la dépense", variant: "destructive" });
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase.from('mcard_expenses').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Dépense supprimée" });
      await loadExpenses();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    }
  };

  return { expenses, stats, loading, addExpense, deleteExpense, categories: EXPENSE_CATEGORIES, refetch: loadExpenses };
};
