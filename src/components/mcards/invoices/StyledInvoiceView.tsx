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
  const { toast } = useToast();

  // Récupérer le template (par défaut ou personnalisé)
  const getTemplate = () => {
    // Vérifier si c'est un modèle personnalisé
    const customTemplates = JSON.parse(localStorage.getItem('customInvoiceTemplates') || '[]');
    const customTemplate = customTemplates.find((t: any) => t.id === templateId);
    
    if (customTemplate) {
      // Créer un objet InvoiceTemplate à partir du modèle personnalisé
      return {
        id: customTemplate.id,
        name: customTemplate.name,
        description: customTemplate.description,
        preview: '',
        styles: {
          primaryColor: customTemplate.colors[0] || '#000000',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          borderColor: customTemplate.colors[1] || '#e5e5e5',
          headerStyle: 'modern' as const,
          layout: 'standard' as const,
          fontFamily: 'sans-serif'
        },
        customColors: customTemplate.colors
      };
    }
    
    // Sinon, utiliser le template par défaut
    return invoiceTemplates.find(t => t.id === templateId) || invoiceTemplates[0];
  };

  const template = getTemplate();

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
    try {
      const html2canvas = (await import('html2canvas')).default;
      const invoiceElement = document.getElementById('invoice-content');
      
      if (!invoiceElement) {
        toast({
          title: "Erreur",
          description: "Impossible de trouver le contenu de la facture",
          variant: "destructive"
        });
        return;
      }

      // Créer le canvas pour partager l'image avec un fond blanc fixe
      const canvas = await html2canvas(invoiceElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Nettoyer les styles HSL qui causent des problèmes
          const clonedElement = clonedDoc.getElementById('invoice-content');
          if (clonedElement) {
            clonedElement.style.backgroundColor = '#ffffff';
          }
        }
      });

      // Convertir en blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast({
            title: "Erreur",
            description: "Impossible de créer l'image",
            variant: "destructive"
          });
          return;
        }

        const file = new File([blob], `facture-${invoice.invoice_number}.png`, { type: 'image/png' });
        
        // Partager l'image si l'API de partage est disponible
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `Facture ${invoice.invoice_number}`,
              text: `Facture de ${invoice.amount.toLocaleString()} ${invoice.currency} pour ${invoice.client_name}`,
            });
            toast({
              title: "Succès",
              description: "Facture partagée avec succès"
            });
          } catch (error) {
            if ((error as Error).name !== 'AbortError') {
              console.error('Erreur lors du partage:', error);
              toast({
                title: "Erreur",
                description: "Erreur lors du partage",
                variant: "destructive"
              });
            }
          }
        } else {
          // Fallback: télécharger l'image
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `facture-${invoice.invoice_number}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast({
            title: "Succès",
            description: "Facture téléchargée avec succès"
          });
        }
      }, 'image/png');
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du partage de la facture",
        variant: "destructive"
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      // Trouver l'élément de la facture
      const invoiceElement = document.getElementById('invoice-content');
      if (!invoiceElement) {
        toast({
          title: "Erreur",
          description: "Impossible de trouver le contenu de la facture",
          variant: "destructive"
        });
        return;
      }

      // Créer le canvas avec un fond blanc fixe
      const canvas = await html2canvas(invoiceElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Nettoyer les styles HSL qui causent des problèmes
          const clonedElement = clonedDoc.getElementById('invoice-content');
          if (clonedElement) {
            clonedElement.style.backgroundColor = '#ffffff';
          }
        }
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
          toast({
            title: "Succès",
            description: "Facture téléchargée avec succès"
          });
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de créer l'image",
            variant: "destructive"
          });
        }
      }, 'image/png');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de la facture",
        variant: "destructive"
      });
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">{invoice.invoice_number}</h1>
                <Badge 
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 mt-2"
                >
                  {getStatusLabel(invoice.status)}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 flex-1 sm:flex-none min-w-[40px]"
              >
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                <span className="hidden sm:inline ml-2">{copied ? 'Copié!' : 'Partager'}</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrint}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 flex-1 sm:flex-none min-w-[40px]"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Imprimer</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 flex-1 sm:flex-none min-w-[40px]"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Télécharger</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 flex-1 sm:flex-none"
              >
                Fermer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu de la facture - optimisé pour l'impression */}
      <Card id="invoice-content" style={cardStyle} className="print:shadow-none print:border-0">
        <CardHeader style={{ borderBottomColor: template.styles.borderColor }} className="print:border-b-2">
          <CardTitle className="flex items-center justify-between print:mb-4">
            <span className="print:text-2xl">Facture {invoice.invoice_number}</span>
            <div className="text-right">
              <div className="text-3xl font-bold print:text-4xl" style={{ color: template.styles.primaryColor }}>
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
              <div className="border rounded-lg overflow-hidden print:rounded-none print:border-2" style={{ borderColor: template.styles.borderColor }}>
                <table className="w-full print:text-base">
                  <thead style={{ backgroundColor: template.styles.primaryColor, color: 'white' }} className="print:bg-gray-800">
                    <tr>
                      <th className="text-left p-3 print:p-4">Description</th>
                      <th className="text-center p-3 print:p-4">Quantité</th>
                      <th className="text-right p-3 print:p-4">Prix unitaire</th>
                      <th className="text-right p-3 print:p-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr 
                        key={index} 
                        className="border-t print:border-gray-300" 
                        style={{ 
                          borderTopColor: template.styles.borderColor,
                          backgroundColor: index % 2 === 0 ? 'transparent' : (template.customColors?.[2] ? `${template.customColors[2]}10` : 'transparent')
                        }}
                      >
                        <td className="p-3 print:p-4">{item.description}</td>
                        <td className="p-3 print:p-4 text-center">{item.quantity}</td>
                        <td className="p-3 print:p-4 text-right">{item.unit_price.toLocaleString()} FCFA</td>
                        <td className="p-3 print:p-4 text-right font-medium">{item.total_price.toLocaleString()} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot 
                    style={{ 
                      backgroundColor: template.customColors?.[3] ? `${template.customColors[3]}20` : template.styles.primaryColor + '20', 
                      borderTopColor: template.styles.borderColor 
                    }} 
                    className="print:bg-gray-100 print:border-t-4 print:border-gray-800"
                  >
                    <tr>
                      <td colSpan={3} className="p-3 print:p-4 text-right font-semibold print:text-lg">Total général:</td>
                      <td className="p-3 print:p-4 text-right font-bold text-lg print:text-xl" style={{ color: template.styles.primaryColor }}>
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