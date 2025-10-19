import { Quote } from '@/types/quote';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StyledQuoteViewProps {
  quote: Quote;
  mcard: any;
}

export const StyledQuoteView = ({ quote, mcard }: StyledQuoteViewProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');

  // Fetch customization colors from mcard or use default
  useEffect(() => {
    const fetchCustomization = async () => {
      const { data } = await supabase
        .from('mcard_customization')
        .select('*')
        .eq('mcard_id', mcard.id)
        .single();
      
      if (data && data.theme) {
        // Use theme color if available, otherwise default
        setPrimaryColor('#3B82F6');
      }
    };
    
    if (mcard?.id) {
      fetchCustomization();
    }
  }, [mcard?.id]);

  const generateQuoteImage = async () => {
    const element = document.getElementById('quote-content');
    if (!element) return null;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      return canvas;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    try {
      const canvas = await generateQuoteImage();
      if (!canvas) {
        throw new Error('Impossible de générer l\'image');
      }

      // Télécharger comme image PNG
      const link = document.createElement('a');
      link.download = `devis-${quote.quote_number}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: 'Succès',
        description: 'Le devis a été téléchargé'
      });
    } catch (error) {
      console.error('Error downloading quote:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de télécharger le devis'
      });
    }
  };

  const fallbackShare = async (blob: Blob, shareText: string, shareUrl: string) => {
    try {
      // Télécharger l'image automatiquement
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devis-${quote.quote_number}.png`;
      link.click();
      URL.revokeObjectURL(url);

      // Copier le texte dans le presse-papier
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      
      toast({
        title: 'Image téléchargée',
        description: 'L\'image a été téléchargée et le lien copié. Vous pouvez maintenant la partager sur vos réseaux sociaux.'
      });
    } catch (error) {
      console.error('Error in fallback share:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de partager le devis'
      });
    }
  };

  const handleShareOld = async () => {
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

  const handleShare = async () => {
    try {
      const canvas = await generateQuoteImage();
      if (!canvas) {
        throw new Error('Impossible de générer l\'image');
      }

      // Convertir le canvas en blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Impossible de générer l\'image du devis'
          });
          return;
        }

        const file = new File([blob], `devis-${quote.quote_number}.png`, { type: 'image/png' });
        const shareUrl = window.location.origin + `/mcard/${mcard.slug}/quotes`;
        const shareText = `Devis ${quote.quote_number} - ${mcard.full_name}\nMontant: ${quote.amount.toLocaleString()} ${quote.currency}`;

        // Vérifier si l'API Web Share est disponible et supporte les fichiers
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `Devis ${quote.quote_number}`,
              text: shareText,
              files: [file]
            });
            
            toast({
              title: 'Succès',
              description: 'Devis partagé avec succès'
            });
          } catch (error) {
            if ((error as Error).name !== 'AbortError') {
              console.error('Error sharing:', error);
              // Fallback si le partage échoue
              await fallbackShare(blob, shareText, shareUrl);
            }
          }
        } else {
          // Fallback pour les navigateurs qui ne supportent pas le partage de fichiers
          await fallbackShare(blob, shareText, shareUrl);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error sharing quote:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de partager le devis'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className={`flex ${isMobile ? 'flex-col' : 'justify-end'} gap-2 mb-4`}>
        <Button onClick={handleDownload} size={isMobile ? "default" : "sm"} variant="outline" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Télécharger
        </Button>
        <Button onClick={handleShare} size={isMobile ? "default" : "sm"} variant="outline" className="w-full sm:w-auto">
          <Share2 className="w-4 h-4 mr-2" />
          Partager
        </Button>
      </div>

      <div id="quote-content" className="bg-white p-4 sm:p-8 rounded-lg border">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 gap-4" style={{ borderColor: primaryColor }}>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: primaryColor }}>DEVIS</h1>
            <p className="text-base sm:text-lg font-semibold text-gray-700">{quote.quote_number}</p>
          </div>
          <div className="sm:text-right">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">{mcard.full_name}</h2>
            {mcard.company && <p className="text-sm sm:text-base text-gray-600">{mcard.company}</p>}
            {mcard.phone_number && <p className="text-sm sm:text-base text-gray-600">{mcard.phone_number}</p>}
            {mcard.email && <p className="text-sm sm:text-base text-gray-600 break-all">{mcard.email}</p>}
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2 sm:mb-3">Client</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded">
            <p className="font-semibold text-base sm:text-lg">{quote.client_name}</p>
            {quote.client_email && <p className="text-sm sm:text-base text-gray-600 break-all">{quote.client_email}</p>}
            {quote.client_phone && <p className="text-sm sm:text-base text-gray-600">{quote.client_phone}</p>}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Date d'émission</p>
            <p className="font-semibold text-sm sm:text-base">
              {quote.issued_date ? format(new Date(quote.issued_date), 'dd MMMM yyyy', { locale: fr }) : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Valable jusqu'au</p>
            <p className="font-semibold text-sm sm:text-base">
              {quote.valid_until ? format(new Date(quote.valid_until), 'dd MMMM yyyy', { locale: fr }) : '-'}
            </p>
          </div>
        </div>

        {/* Description */}
        {quote.description && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
            <p className="text-sm sm:text-base text-gray-700">{quote.description}</p>
          </div>
        )}

        {/* Items Table */}
        <div className="mb-6 sm:mb-8 overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-full">
            <thead>
              <tr className="text-white" style={{ backgroundColor: primaryColor }}>
                <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Description</th>
                <th className="text-center p-2 sm:p-3 text-xs sm:text-sm">Qté</th>
                <th className="text-right p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">Prix unit.</th>
                <th className="text-right p-2 sm:p-3 text-xs sm:text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.items?.map((item, index) => (
                <tr key={item.id || index} className="border-b">
                  <td className="p-2 sm:p-3 text-xs sm:text-sm">{item.description}</td>
                  <td className="text-center p-2 sm:p-3 text-xs sm:text-sm">{item.quantity}</td>
                  <td className="text-right p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">
                    {item.unit_price.toLocaleString()} {quote.currency}
                  </td>
                  <td className="text-right p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">
                    {item.total_price.toLocaleString()} {quote.currency}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={3} className="text-right p-2 sm:p-3 text-xs sm:text-sm">TOTAL</td>
                <td className="text-right p-2 sm:p-3 text-sm sm:text-lg whitespace-nowrap" style={{ color: primaryColor }}>
                  {quote.amount.toLocaleString()} {quote.currency}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2">Notes</h3>
            <p className="text-gray-700 text-xs sm:text-sm">{quote.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t text-center text-xs sm:text-sm text-gray-500">
          <p>Merci de votre confiance</p>
        </div>
      </div>
    </div>
  );
};
