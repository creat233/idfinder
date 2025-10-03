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
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        removeContainer: true,
        windowWidth: 1200,
        windowHeight: 1600
      });
      
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
      {/* En-tête avec actions */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
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
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Logo FinderID */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
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
              <div className="mt-2 text-3xl font-bold text-primary">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <h3 className="font-semibold mb-3">Articles</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3">Description</th>
                      <th className="text-center p-3">Quantité</th>
                      <th className="text-right p-3">Prix unitaire</th>
                      <th className="text-right p-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{item.description}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">{item.unit_price.toLocaleString()} FCFA</td>
                        <td className="p-3 text-right font-medium">{item.total_price.toLocaleString()} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/50 border-t-2">
                    <tr>
                      <td colSpan={3} className="p-3 text-right font-semibold">Total général:</td>
                      <td className="p-3 text-right font-bold text-lg">{invoice.amount.toLocaleString()} {invoice.currency}</td>
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