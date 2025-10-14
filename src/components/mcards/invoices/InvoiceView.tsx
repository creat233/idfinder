import { useState, useEffect, useRef } from 'react';
import { Invoice } from '@/types/invoice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Download,
  Share2,
  Printer,
  Copy,
  Check,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';

interface InvoiceViewProps {
  invoice: Invoice;
  onClose: () => void;
}

interface MCardOwner {
  id: string;
  full_name: string;
  company?: string;
  email?: string;
  phone_number?: string;
  profile_picture_url?: string;
  website_url?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-success text-success-foreground';
    case 'sent':
      return 'bg-info text-info-foreground';
    case 'overdue':
      return 'bg-destructive text-destructive-foreground';
    case 'cancelled':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-warning text-warning-foreground';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft':
      return 'Brouillon';
    case 'sent':
      return 'Envoyée';
    case 'paid':
      return 'Payée';
    case 'overdue':
      return 'En retard';
    case 'cancelled':
      return 'Annulée';
    default:
      return status;
  }
};

export const InvoiceView = ({ invoice, onClose }: InvoiceViewProps) => {
  const [copied, setCopied] = useState(false);
  const [mcardOwner, setMcardOwner] = useState<MCardOwner | null>(null);
  const { showSuccess } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMCardOwner = async () => {
      try {
        const { data, error } = await supabase
          .from('mcards')
          .select('id, full_name, company, email, phone_number, profile_picture_url, website_url')
          .eq('id', invoice.mcard_id)
          .single();

        if (error) throw error;
        setMcardOwner(data);
      } catch (error) {
        console.error('Error fetching mCard owner:', error);
      }
    };

    fetchMCardOwner();
  }, [invoice.mcard_id]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/invoice/${invoice.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Facture ${invoice.invoice_number}`,
          text: `Facture de ${invoice.amount.toLocaleString()} ${invoice.currency} pour ${invoice.client_name}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showSuccess('Succès', 'Lien copié dans le presse-papiers');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    
    try {
      // Créer un clone pour le rendu
      const elementToCapture = invoiceRef.current.cloneNode(true) as HTMLElement;
      
      // Cacher temporairement les boutons d'action dans le clone
      const actionButtons = elementToCapture.querySelector('[data-action-buttons]');
      if (actionButtons) {
        (actionButtons as HTMLElement).style.display = 'none';
      }
      
      // Ajouter le clone au DOM temporairement
      elementToCapture.style.position = 'absolute';
      elementToCapture.style.left = '-9999px';
      elementToCapture.style.width = '1200px';
      document.body.appendChild(elementToCapture);
      
      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        width: 1200,
        height: elementToCapture.scrollHeight,
      });
      
      // Nettoyer
      document.body.removeChild(elementToCapture);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const element = document.createElement('a');
          element.href = url;
          element.download = `facture-${invoice.invoice_number}.png`;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          URL.revokeObjectURL(url);
          showSuccess('Succès', 'Facture téléchargée au format PNG');
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      showSuccess('Erreur', 'Erreur lors du téléchargement de la facture');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" ref={invoiceRef}>
      {/* En-tête avec actions - caché à l'impression */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white print:hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{invoice.invoice_number}</h1>
                <Badge 
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 mt-2"
                >
                  {getStatusLabel(invoice.status)}
                </Badge>
              </div>
            </div>
            
            <div data-action-buttons className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 flex-1 sm:flex-none"
              >
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                <span className="ml-1 sm:ml-2">{copied ? 'Copié!' : 'Partager'}</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrint}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 hidden sm:flex"
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 flex-1 sm:flex-none"
              >
                <Download className="h-4 w-4" />
                <span className="ml-1 sm:ml-2">Télécharger</span>
              </Button>
              <Button
                variant="secondary"
                onClick={onClose}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto"
              >
                Fermer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu de la facture - optimisé pour l'impression */}
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b print:bg-white print:border-b-2 print:border-gray-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Logo FinderID */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg print:shadow-none print:border-2 print:border-blue-600">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FinderID</h1>
                <p className="text-sm text-gray-600">Facture professionnelle</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Facture N°</p>
              <p className="text-xl font-bold text-gray-900">{invoice.invoice_number}</p>
              <div className="mt-2 text-3xl font-bold text-primary print:text-blue-600">
                {invoice.amount.toLocaleString()} {invoice.currency}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Informations du propriétaire */}
          {mcardOwner && (
            <div className="border-b pb-6">
              <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Émetteur
              </h3>
              <div className="flex items-start gap-4">
                {mcardOwner.profile_picture_url && (
                  <img 
                    src={mcardOwner.profile_picture_url} 
                    alt={mcardOwner.full_name}
                    className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-lg">{mcardOwner.full_name}</span>
                  </div>
                  
                  {mcardOwner.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{mcardOwner.company}</span>
                    </div>
                  )}
                  
                  {mcardOwner.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{mcardOwner.email}</span>
                    </div>
                  )}
                  
                  {mcardOwner.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{mcardOwner.phone_number}</span>
                    </div>
                  )}
                  
                  {mcardOwner.website_url && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={mcardOwner.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {mcardOwner.website_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Informations client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-semibold mb-3">Informations client</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{invoice.client_name}</span>
                </div>
                
                {invoice.client_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{invoice.client_email}</span>
                  </div>
                )}
                
                {invoice.client_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{invoice.client_phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="font-semibold mb-3">Dates importantes</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Créée le {new Date(invoice.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                
                {invoice.due_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                
                {invoice.paid_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-success" />
                    <span className="text-success">Payée le {new Date(invoice.paid_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Articles */}
          {invoice.items && invoice.items.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 print:text-lg print:font-bold">Articles</h3>
              <div className="border rounded-lg overflow-x-auto print:rounded-none print:border-2 print:border-gray-300">
                <table className="w-full text-sm sm:text-base print:text-base">
                  <thead className="bg-muted/50 print:bg-gray-800 print:text-white">
                    <tr>
                      <th className="text-left p-2 sm:p-3 print:p-4">Description</th>
                      <th className="text-center p-2 sm:p-3 print:p-4">Quantité</th>
                      <th className="text-right p-2 sm:p-3 print:p-4 print:table-cell">Prix unitaire</th>
                      <th className="text-right p-2 sm:p-3 print:p-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-t print:border-gray-300">
                        <td className="p-2 sm:p-3 print:p-4">{item.description}</td>
                        <td className="p-2 sm:p-3 print:p-4 text-center">{item.quantity}</td>
                        <td className="p-2 sm:p-3 print:p-4 text-right print:table-cell">{item.unit_price.toLocaleString()} FCFA</td>
                        <td className="p-2 sm:p-3 print:p-4 text-right font-medium">{item.total_price.toLocaleString()} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/50 border-t-2 print:bg-gray-100 print:border-t-4 print:border-gray-800">
                    <tr>
                      <td colSpan={3} className="p-2 sm:p-3 print:p-4 text-right font-semibold text-sm sm:text-base print:text-lg">Total général:</td>
                      <td className="p-2 sm:p-3 print:p-4 text-right font-bold text-base sm:text-lg print:text-xl">{invoice.amount.toLocaleString()} {invoice.currency}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Description et notes */}
          {(invoice.description || invoice.notes) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {invoice.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{invoice.description}</p>
                </div>
              )}
              
              {invoice.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes internes</h3>
                  <p className="text-muted-foreground">{invoice.notes}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};