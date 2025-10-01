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
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Lock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoiceListProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onView: (invoice: Invoice) => void;
  onValidate: (invoiceId: string) => void;
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

export const InvoiceList = ({ invoices, onEdit, onDelete, onView, onValidate }: InvoiceListProps) => {
  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune facture</h3>
          <p className="text-muted-foreground text-center">
            Créez votre première facture pour commencer à gérer vos ventes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* En-tête */}
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">
                      {invoice.invoice_number}
                    </h3>
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusLabel(invoice.status)}
                    </Badge>
                    {invoice.is_validated && (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Validée
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {invoice.amount.toLocaleString()} {invoice.currency}
                    </div>
                  </div>
                </div>

                {/* Informations client */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{invoice.client_name}</span>
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

                {/* Dates */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Créée {formatDistance(new Date(invoice.created_at), new Date(), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    </span>
                  </div>
                  
                  {invoice.due_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {invoice.description && (
                  <p className="text-sm text-muted-foreground">
                    {invoice.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(invoice)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </DropdownMenuItem>
                    {!invoice.is_validated && (
                      <>
                        <DropdownMenuItem onClick={() => onValidate(invoice.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Valider
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(invoice)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(invoice.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};