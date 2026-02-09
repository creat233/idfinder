import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MCardPdfReportProps {
  mcardId: string;
  mcardName: string;
}

export const MCardPdfReport = ({ mcardId, mcardName }: MCardPdfReportProps) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const generateReport = async (monthsBack: number = 0) => {
    try {
      setGenerating(true);
      const targetDate = subMonths(new Date(), monthsBack);
      const start = startOfMonth(targetDate);
      const end = endOfMonth(targetDate);
      const monthLabel = format(targetDate, 'MMMM yyyy', { locale: fr });

      // Load data
      const [invoicesRes, expensesRes, productsRes] = await Promise.all([
        supabase.from('mcard_invoices').select('*').eq('mcard_id', mcardId)
          .gte('created_at', start.toISOString()).lte('created_at', end.toISOString()),
        supabase.from('mcard_expenses').select('*').eq('mcard_id', mcardId)
          .gte('expense_date', start.toISOString().split('T')[0]).lte('expense_date', end.toISOString().split('T')[0]),
        supabase.from('mcard_products').select('name, stock_quantity, price, currency').eq('mcard_id', mcardId).eq('is_active', true)
      ]);

      const invoices = invoicesRes.data || [];
      const expenses = expensesRes.data || [];
      const products = productsRes.data || [];

      const totalRevenue = invoices.filter(i => i.is_validated).reduce((s, i) => s + (i.amount || 0), 0);
      const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
      const profit = totalRevenue - totalExpenses;
      const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

      // Generate PDF
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(30, 64, 175);
      doc.text('Rapport Mensuel', 14, 20);
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`${mcardName} - ${monthLabel}`, 14, 28);
      doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: fr })}`, 14, 35);

      // Line
      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.5);
      doc.line(14, 38, 196, 38);

      // Summary
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Résumé Financier', 14, 48);

      autoTable(doc, {
        startY: 52,
        head: [['Indicateur', 'Montant (FCFA)']],
        body: [
          ['Chiffre d\'affaires', fmt(totalRevenue)],
          ['Dépenses totales', fmt(totalExpenses)],
          ['Bénéfice net', fmt(profit)],
          ['Marge bénéficiaire', `${totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0}%`],
          ['Nombre de factures', invoices.length.toString()],
          ['Factures validées', invoices.filter(i => i.is_validated).length.toString()],
        ],
        theme: 'grid',
        headStyles: { fillColor: [30, 64, 175] }
      });

      // Invoices table
      if (invoices.length > 0) {
        const lastY = (doc as any).lastAutoTable?.finalY || 100;
        doc.setFontSize(14);
        doc.text('Détail des Factures', 14, lastY + 12);

        autoTable(doc, {
          startY: lastY + 16,
          head: [['N° Facture', 'Client', 'Montant', 'Statut']],
          body: invoices.map(inv => [
            inv.invoice_number,
            inv.client_name,
            fmt(inv.amount) + ' FCFA',
            inv.is_validated ? 'Validée' : inv.status
          ]),
          theme: 'striped',
          headStyles: { fillColor: [16, 185, 129] }
        });
      }

      // Expenses table
      if (expenses.length > 0) {
        const lastY = (doc as any).lastAutoTable?.finalY || 150;
        if (lastY > 240) doc.addPage();
        const startY = lastY > 240 ? 20 : lastY + 12;
        
        doc.setFontSize(14);
        doc.text('Détail des Dépenses', 14, startY);

        autoTable(doc, {
          startY: startY + 4,
          head: [['Description', 'Catégorie', 'Montant', 'Date']],
          body: expenses.map(exp => [
            exp.description,
            exp.category,
            fmt(Number(exp.amount)) + ' FCFA',
            format(new Date(exp.expense_date), 'dd/MM/yyyy')
          ]),
          theme: 'striped',
          headStyles: { fillColor: [239, 68, 68] }
        });
      }

      // Stock status
      const stockProducts = products.filter(p => p.stock_quantity !== null);
      if (stockProducts.length > 0) {
        const lastY = (doc as any).lastAutoTable?.finalY || 200;
        if (lastY > 240) doc.addPage();
        const startY = lastY > 240 ? 20 : lastY + 12;

        doc.setFontSize(14);
        doc.text('État des Stocks', 14, startY);

        autoTable(doc, {
          startY: startY + 4,
          head: [['Produit', 'Quantité', 'Prix unitaire']],
          body: stockProducts.map(p => [
            p.name,
            p.stock_quantity?.toString() || '0',
            fmt(p.price) + ' ' + p.currency
          ]),
          theme: 'striped',
          headStyles: { fillColor: [139, 92, 246] }
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i}/${pageCount} - Rapport généré par MCard Business`, 14, 287);
      }

      doc.save(`rapport-${mcardName.replace(/\s+/g, '-')}-${format(targetDate, 'yyyy-MM')}.pdf`);
      toast({ title: "Rapport généré", description: `Le rapport de ${monthLabel} a été téléchargé.` });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({ title: "Erreur", description: "Impossible de générer le rapport", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-blue-600" />
          Rapports PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">Générez des rapports mensuels détaillés avec vos revenus, dépenses, et état des stocks.</p>
        
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => generateReport(0)} disabled={generating} className="text-xs h-9">
            {generating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <FileDown className="h-3 w-3 mr-1" />}
            Ce mois
          </Button>
          <Button size="sm" variant="outline" onClick={() => generateReport(1)} disabled={generating} className="text-xs h-9">
            <FileDown className="h-3 w-3 mr-1" />
            Mois dernier
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {[2, 3, 4].map(m => (
            <Button key={m} size="sm" variant="ghost" onClick={() => generateReport(m)} disabled={generating} className="text-[10px] h-7">
              {format(subMonths(new Date(), m), 'MMM yy', { locale: fr })}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
