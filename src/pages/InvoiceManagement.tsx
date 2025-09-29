import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, BarChart3, ArrowLeft, Palette } from 'lucide-react';
import { InvoiceCreateForm } from '@/components/mcards/invoices/InvoiceCreateForm';
import { InvoiceList } from '@/components/mcards/invoices/InvoiceList';
import { InvoiceDashboard } from '@/components/mcards/invoices/InvoiceDashboard';
import { InvoiceView } from '@/components/mcards/invoices/InvoiceView';
import { InvoiceTemplateSelector } from '@/components/mcards/invoices/InvoiceTemplateSelector';
import { StyledInvoiceView } from '@/components/mcards/invoices/StyledInvoiceView';
import { useInvoices } from '@/hooks/useInvoices';
import { useMCards } from '@/hooks/useMCards';
import { Invoice } from '@/types/invoice';
import { Link } from 'react-router-dom';

export default function InvoiceManagement() {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'create' | 'view' | 'templates'>('dashboard');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');

  const { mcards } = useMCards();
  const mcard = mcards.find(m => m.slug === slug);

  const {
    invoices,
    stats,
    loading,
    addInvoice,
    editInvoice,
    removeInvoice,
    getAnalytics
  } = useInvoices(mcard?.id || '');

  if (!slug) {
    return <Navigate to="/mcards" replace />;
  }

  if (!mcard) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">MCard introuvable</h3>
              <p className="text-muted-foreground text-center mb-4">
                La carte de visite demandée n'existe pas ou vous n'y avez pas accès.
              </p>
              <Link to="/mcards">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux MCards
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Vérifier que la MCard a un plan payant
  if (mcard.plan === 'free') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Fonctionnalité Premium</h3>
              <p className="text-muted-foreground text-center mb-4">
                La gestion des factures est disponible uniquement avec les plans Essentiel et Premium.
              </p>
              <Link to={`/mcards/${slug}/upgrade`}>
                <Button>
                  Mettre à niveau
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const handleCreateInvoice = async (data: any) => {
    await addInvoice(data);
    setActiveTab('invoices');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setActiveTab('create');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setActiveTab('view');
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      await removeInvoice(invoiceId);
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Chargement...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
        {/* En-tête - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">Gestion des Factures</h1>
            <p className="text-muted-foreground text-sm sm:text-base truncate">
              {mcard.full_name} - {mcard.company}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link to={`/mcard/${slug}`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Retour à la MCard</span>
                <span className="sm:hidden">Retour</span>
              </Button>
            </Link>
            {activeTab !== 'create' && activeTab !== 'view' && (
              <Button onClick={() => setActiveTab('create')} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Nouvelle Facture</span>
                <span className="sm:hidden">Nouveau</span>
              </Button>
            )}
          </div>
        </div>

        {/* Onglets - Responsive */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          {activeTab !== 'view' && (
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="dashboard" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Factures </span>
                  ({invoices.length})
                </span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{editingInvoice ? 'Modifier' : 'Créer'}</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3">
                <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Modèles</span>
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="dashboard" className="space-y-6">
            {stats && (
              <InvoiceDashboard 
                stats={stats} 
                getAnalytics={getAnalytics}
              />
            )}
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <InvoiceList 
              invoices={invoices}
              onEdit={handleEditInvoice}
              onDelete={handleDeleteInvoice}
              onView={handleViewInvoice}
            />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <InvoiceCreateForm
              mcardId={mcard.id}
              onSubmit={handleCreateInvoice}
              onCancel={() => {
                setActiveTab('invoices');
                setEditingInvoice(null);
              }}
            />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <InvoiceTemplateSelector 
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
          </TabsContent>

          <TabsContent value="view" className="space-y-6">
            {viewingInvoice && (
              <StyledInvoiceView
                invoice={viewingInvoice}
                templateId={selectedTemplate}
                onClose={() => {
                  setViewingInvoice(null);
                  setActiveTab('invoices');
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}