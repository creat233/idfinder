import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, DollarSign, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MCardAdvancedDashboardProps {
  mcardId: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const MCardAdvancedDashboard = ({ mcardId }: MCardAdvancedDashboardProps) => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [totals, setTotals] = useState({ revenue: 0, expenses: 0, profit: 0, profitMargin: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [mcardId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load last 6 months of invoices
      const sixMonthsAgo = subMonths(new Date(), 6);
      const { data: invoices } = await supabase
        .from('mcard_invoices')
        .select('amount, is_validated, created_at')
        .eq('mcard_id', mcardId)
        .gte('created_at', sixMonthsAgo.toISOString());

      // Load expenses
      const { data: expenses } = await supabase
        .from('mcard_expenses')
        .select('amount, category, expense_date')
        .eq('mcard_id', mcardId)
        .gte('expense_date', sixMonthsAgo.toISOString().split('T')[0]);

      // Build monthly data
      const months: MonthlyData[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        const label = format(date, 'MMM', { locale: fr });

        const monthRevenue = (invoices || [])
          .filter(inv => inv.is_validated && new Date(inv.created_at) >= start && new Date(inv.created_at) <= end)
          .reduce((s, inv) => s + (inv.amount || 0), 0);

        const monthExpenses = (expenses || [])
          .filter(exp => new Date(exp.expense_date) >= start && new Date(exp.expense_date) <= end)
          .reduce((s, exp) => s + Number(exp.amount || 0), 0);

        months.push({ month: label, revenue: monthRevenue, expenses: monthExpenses, profit: monthRevenue - monthExpenses });
      }
      setMonthlyData(months);

      // Category breakdown for expenses
      const catMap: Record<string, number> = {};
      (expenses || []).forEach(e => {
        catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount);
      });
      setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));

      // Totals
      const totalRev = (invoices || []).filter(i => i.is_validated).reduce((s, i) => s + (i.amount || 0), 0);
      const totalExp = (expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0);
      const profit = totalRev - totalExp;
      setTotals({
        revenue: totalRev,
        expenses: totalExp,
        profit,
        profitMargin: totalRev > 0 ? Math.round((profit / totalRev) * 100) : 0
      });
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  if (loading) {
    return (
      <Card><CardContent className="py-8 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
      </CardContent></Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4 text-indigo-600" />
          Tableau de Bord Avancé
          <Badge variant="outline" className="text-[10px]">6 mois</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 bg-green-50 rounded-lg text-center">
            <DollarSign className="h-4 w-4 text-green-600 mx-auto" />
            <p className="text-[10px] text-muted-foreground mt-1">Revenus</p>
            <p className="font-bold text-xs text-green-700">{fmt(totals.revenue)}</p>
          </div>
          <div className="p-2.5 bg-red-50 rounded-lg text-center">
            <Receipt className="h-4 w-4 text-red-600 mx-auto" />
            <p className="text-[10px] text-muted-foreground mt-1">Dépenses</p>
            <p className="font-bold text-xs text-red-700">{fmt(totals.expenses)}</p>
          </div>
          <div className={`p-2.5 rounded-lg text-center ${totals.profit >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
            {totals.profit >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-blue-600 mx-auto" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-orange-600 mx-auto" />
            )}
            <p className="text-[10px] text-muted-foreground mt-1">Bénéfice</p>
            <p className={`font-bold text-xs ${totals.profit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
              {fmt(totals.profit)}
            </p>
          </div>
        </div>

        {/* Revenue vs Expenses Chart */}
        {monthlyData.some(m => m.revenue > 0 || m.expenses > 0) && (
          <div>
            <p className="text-xs font-medium mb-2">Revenus vs Dépenses</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => fmt(v) + ' FCFA'} />
                <Bar dataKey="revenue" fill="#10b981" name="Revenus" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" name="Dépenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Profit trend */}
        {monthlyData.some(m => m.profit !== 0) && (
          <div>
            <p className="text-xs font-medium mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Tendance des bénéfices
            </p>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => fmt(v) + ' FCFA'} />
                <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Expense categories pie chart */}
        {categoryData.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-2">Répartition des dépenses</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} innerRadius={25}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1">
                {categoryData.slice(0, 5).map((c, i) => (
                  <div key={c.name} className="flex items-center gap-1.5 text-[10px]">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground flex-1 truncate">{c.name}</span>
                    <span className="font-medium">{fmt(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profit margin */}
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-800">Marge bénéficiaire</span>
            <Badge variant={totals.profitMargin >= 20 ? 'default' : 'secondary'} className="text-[10px]">
              {totals.profitMargin}%
            </Badge>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${totals.profitMargin >= 20 ? 'bg-green-500' : totals.profitMargin >= 0 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${Math.max(0, Math.min(100, totals.profitMargin))}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
