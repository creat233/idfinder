import { Quote } from '@/types/quote';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

interface StyledQuoteViewProps {
  quote: Quote;
  mcard: any;
}

export const StyledQuoteView = ({ quote, mcard }: StyledQuoteViewProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    const element = document.getElementById('quote-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`devis-${quote.quote_number}.pdf`);

      toast({
        title: 'Succès',
        description: 'Le devis a été téléchargé'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de télécharger le devis'
      });
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    toast({
      title: 'Partage',
      description: 'Fonctionnalité à venir'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={handleDownload} size="sm" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Télécharger
        </Button>
        <Button onClick={handleShare} size="sm" variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Partager
        </Button>
      </div>

      <div id="quote-content" className="bg-white p-8 rounded-lg border">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-primary">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">DEVIS</h1>
            <p className="text-lg font-semibold text-gray-700">{quote.quote_number}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">{mcard.full_name}</h2>
            <p className="text-gray-600">{mcard.company}</p>
            <p className="text-gray-600">{mcard.phone_number}</p>
            <p className="text-gray-600">{mcard.email}</p>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Client</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-semibold text-lg">{quote.client_name}</p>
            {quote.client_email && <p className="text-gray-600">{quote.client_email}</p>}
            {quote.client_phone && <p className="text-gray-600">{quote.client_phone}</p>}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500">Date d'émission</p>
            <p className="font-semibold">
              {quote.issued_date ? format(new Date(quote.issued_date), 'dd MMMM yyyy', { locale: fr }) : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Valable jusqu'au</p>
            <p className="font-semibold">
              {quote.valid_until ? format(new Date(quote.valid_until), 'dd MMMM yyyy', { locale: fr }) : '-'}
            </p>
          </div>
        </div>

        {/* Description */}
        {quote.description && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
            <p className="text-gray-700">{quote.description}</p>
          </div>
        )}

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left p-3">Description</th>
                <th className="text-center p-3">Quantité</th>
                <th className="text-right p-3">Prix unitaire</th>
                <th className="text-right p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.items?.map((item, index) => (
                <tr key={item.id || index} className="border-b">
                  <td className="p-3">{item.description}</td>
                  <td className="text-center p-3">{item.quantity}</td>
                  <td className="text-right p-3">{item.unit_price.toLocaleString()} {quote.currency}</td>
                  <td className="text-right p-3">{item.total_price.toLocaleString()} {quote.currency}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={3} className="text-right p-3">TOTAL</td>
                <td className="text-right p-3 text-primary text-lg">
                  {quote.amount.toLocaleString()} {quote.currency}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Notes</h3>
            <p className="text-gray-700 text-sm">{quote.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
          <p>Merci de votre confiance</p>
        </div>
      </div>
    </div>
  );
};
