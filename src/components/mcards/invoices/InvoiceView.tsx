import { useState } from 'react';
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
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface InvoiceViewProps {
  invoice: Invoice;
  onClose: () => void;
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
  const { showSuccess } = useToast();

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

  const handleDownload = () => {
    // Créer un élément temporaire pour le téléchargement
    const element = document.createElement('a');
    const content = `
      FACTURE ${invoice.invoice_number}
      
      Client: ${invoice.client_name}
      ${invoice.client_email ? `Email: ${invoice.client_email}` : ''}
      ${invoice.client_phone ? `Téléphone: ${invoice.client_phone}` : ''}
      
      Date de création: ${new Date(invoice.created_at).toLocaleDateString('fr-FR')}
      ${invoice.due_date ? `Date d'échéance: ${new Date(invoice.due_date).toLocaleDateString('fr-FR')}` : ''}
      
      Articles:
      ${invoice.items?.map(item => 
        `- ${item.description}: ${item.quantity} x ${item.unit_price.toLocaleString()} FCFA = ${item.total_price.toLocaleString()} FCFA`
      ).join('\n') || ''}
      
      TOTAL: ${invoice.amount.toLocaleString()} ${invoice.currency}
      
      ${invoice.description ? `Description: ${invoice.description}` : ''}
      ${invoice.notes ? `Notes: ${invoice.notes}` : ''}
    `;
    
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `facture-${invoice.invoice_number}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Facture {invoice.invoice_number}</span>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {invoice.amount.toLocaleString()} {invoice.currency}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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