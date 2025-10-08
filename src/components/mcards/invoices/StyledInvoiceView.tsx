import { useState, useEffect } from 'react';
import { Invoice } from '@/types/invoice';
import { InvoiceTemplate, invoiceTemplates } from '@/types/invoiceTemplate';
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

interface StyledInvoiceViewProps {
  invoice: Invoice;
  templateId: string;
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

const getStatusColor = (status: string, template: InvoiceTemplate) => {
  const baseStyle = `border border-opacity-20`;
  switch (status) {
    case 'paid':
      return `${baseStyle} bg-green-100 text-green-800 border-green-300`;
    case 'sent':
      return `${baseStyle} bg-blue-100 text-blue-800 border-blue-300`;
    case 'overdue':
      return `${baseStyle} bg-red-100 text-red-800 border-red-300`;
    case 'cancelled':
      return `${baseStyle} bg-gray-100 text-gray-800 border-gray-300`;
    default:
      return `${baseStyle} bg-yellow-100 text-yellow-800 border-yellow-300`;
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

export const StyledInvoiceView = ({ invoice, templateId, onClose }: StyledInvoiceViewProps) => {
  const [copied, setCopied] = useState(false);
  const [mcardOwner, setMcardOwner] = useState<MCardOwner | null>(null);
  const { showSuccess } = useToast();

  const template = invoiceTemplates.find(t => t.id === templateId) || invoiceTemplates[0];

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
    const html2canvas = (await import('html2canvas')).default;
    
    // Trouver l'élément de la facture
    const invoiceElement = document.getElementById('invoice-content');
    if (!invoiceElement) {
      showSuccess('Erreur', 'Impossible de trouver le contenu de la facture');
      return;
    }

    try {
      // Créer le canvas
      const canvas = await html2canvas(invoiceElement, {
        backgroundColor: template.styles.backgroundColor,
        scale: 2, // Meilleure qualité
        logging: false,
        useCORS: true,
      });

      // Convertir en blob et télécharger
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `facture-${invoice.invoice_number}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          showSuccess('Succès', 'Facture téléchargée avec succès');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      showSuccess('Erreur', 'Erreur lors du téléchargement de la facture');
    }
  };

  const headerStyle = {
    backgroundColor: template.styles.primaryColor,
    color: 'white'
  };

  const cardStyle = {
    backgroundColor: template.styles.backgroundColor,
    color: template.styles.textColor,
    borderColor: template.styles.borderColor,
    fontFamily: template.styles.fontFamily
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" style={{ fontFamily: template.styles.fontFamily }}>
      {/* En-tête avec actions */}
      <Card className="shadow-xl border-0 print:hidden" style={headerStyle}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{invoice.invoice_number}</h1>
                <Badge 
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 mt-2"
                >
                  {getStatusLabel(invoice.status)}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {copied ? 'Copié!' : 'Partager'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrint}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Printer className="h-4 w-4" />
                Imprimer
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
              <Button
                variant="secondary"
                onClick={onClose}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                Fermer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu de la facture */}
      <Card id="invoice-content" style={cardStyle}>
        <CardHeader style={{ borderBottomColor: template.styles.borderColor }}>
          <CardTitle className="flex items-center justify-between">
            <span>Facture {invoice.invoice_number}</span>
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: template.styles.primaryColor }}>
                {invoice.amount.toLocaleString()} {invoice.currency}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informations du propriétaire */}
          {mcardOwner && (
            <div className="border-b pb-6" style={{ borderBottomColor: template.styles.borderColor }}>
              <h3 className="font-semibold mb-4 text-lg" style={{ color: template.styles.primaryColor }}>
                Émetteur
              </h3>
              <div className="flex items-start gap-4">
                {mcardOwner.profile_picture_url && (
                  <img 
                    src={mcardOwner.profile_picture_url} 
                    alt={mcardOwner.full_name}
                    className="w-16 h-16 rounded-lg object-cover"
                    style={{ border: `2px solid ${template.styles.borderColor}` }}
                  />
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" style={{ color: template.styles.primaryColor }} />
                    <span className="font-medium text-lg">{mcardOwner.full_name}</span>
                  </div>
                  
                  {mcardOwner.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" style={{ color: template.styles.primaryColor }} />
                      <span>{mcardOwner.company}</span>
                    </div>
                  )}
                  
                  {mcardOwner.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" style={{ color: template.styles.primaryColor }} />
                      <span>{mcardOwner.email}</span>
                    </div>
                  )}
                  
                  {mcardOwner.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" style={{ color: template.styles.primaryColor }} />
                      <span>{mcardOwner.phone_number}</span>
                    </div>
                  )}
                  
                  {mcardOwner.website_url && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" style={{ color: template.styles.primaryColor }} />
                      <a 
                        href={mcardOwner.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={{ color: template.styles.primaryColor }}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: template.styles.primaryColor }}>
                Informations client
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" style={{ color: template.styles.primaryColor }} />
                  <span className="font-medium">{invoice.client_name}</span>
                </div>
                
                {invoice.client_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" style={{ color: template.styles.primaryColor }} />
                    <span>{invoice.client_email}</span>
                  </div>
                )}
                
                {invoice.client_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" style={{ color: template.styles.primaryColor }} />
                    <span>{invoice.client_phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="font-semibold mb-3" style={{ color: template.styles.primaryColor }}>
                Dates importantes
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" style={{ color: template.styles.primaryColor }} />
                  <span>Créée le {new Date(invoice.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                
                {invoice.due_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" style={{ color: template.styles.primaryColor }} />
                    <span>Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                
                {invoice.paid_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Payée le {new Date(invoice.paid_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Articles */}
          {invoice.items && invoice.items.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3" style={{ color: template.styles.primaryColor }}>
                Articles
              </h3>
              <div className="border rounded-lg overflow-hidden" style={{ borderColor: template.styles.borderColor }}>
                <table className="w-full">
                  <thead style={{ backgroundColor: template.styles.primaryColor, color: 'white' }}>
                    <tr>
                      <th className="text-left p-3">Description</th>
                      <th className="text-center p-3">Quantité</th>
                      <th className="text-right p-3">Prix unitaire</th>
                      <th className="text-right p-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-t" style={{ borderTopColor: template.styles.borderColor }}>
                        <td className="p-3">{item.description}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">{item.unit_price.toLocaleString()} FCFA</td>
                        <td className="p-3 text-right font-medium">{item.total_price.toLocaleString()} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot style={{ backgroundColor: template.styles.primaryColor + '20', borderTopColor: template.styles.borderColor }}>
                    <tr>
                      <td colSpan={3} className="p-3 text-right font-semibold">Total général:</td>
                      <td className="p-3 text-right font-bold text-lg" style={{ color: template.styles.primaryColor }}>
                        {invoice.amount.toLocaleString()} {invoice.currency}
                      </td>
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
                  <h3 className="font-semibold mb-2" style={{ color: template.styles.primaryColor }}>
                    Description
                  </h3>
                  <p className="opacity-80">{invoice.description}</p>
                </div>
              )}
              
              {invoice.notes && (
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: template.styles.primaryColor }}>
                    Notes internes
                  </h3>
                  <p className="opacity-80">{invoice.notes}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};