import { useState, useEffect } from 'react';
import { Invoice, InvoiceCreateData, InvoiceStats, InvoiceAnalytics } from '@/types/invoice';
import { 
  fetchInvoices, 
  createInvoice, 
  updateInvoice, 
  deleteInvoice, 
  getInvoiceStats,
  getInvoiceAnalytics 
} from '@/services/invoiceService';
import { useToast } from '@/hooks/useToast';

export const useInvoices = (mcardId: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const [invoicesData, statsData] = await Promise.all([
        fetchInvoices(mcardId),
        getInvoiceStats(mcardId)
      ]);
      setInvoices(invoicesData);
      setStats(statsData);
    } catch (error: any) {
      console.error('Error loading invoices:', error);
      showError('Erreur', 'Impossible de charger les factures');
    } finally {
      setLoading(false);
    }
  };

  const addInvoice = async (invoiceData: InvoiceCreateData) => {
    try {
      const newInvoice = await createInvoice(invoiceData);
      setInvoices(prev => [newInvoice, ...prev]);
      await loadInvoices(); // Recharger pour mettre à jour les stats
      showSuccess('Succès', 'Facture créée avec succès');
      return newInvoice;
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      showError('Erreur', 'Impossible de créer la facture');
      throw error;
    }
  };

  const editInvoice = async (id: string, updates: Partial<Invoice>) => {
    try {
      const updatedInvoice = await updateInvoice(id, updates);
      setInvoices(prev => prev.map(inv => inv.id === id ? updatedInvoice : inv));
      await loadInvoices(); // Recharger pour mettre à jour les stats
      showSuccess('Succès', 'Facture mise à jour');
      return updatedInvoice;
    } catch (error: any) {
      console.error('Error updating invoice:', error);
      showError('Erreur', 'Impossible de mettre à jour la facture');
      throw error;
    }
  };

  const removeInvoice = async (id: string) => {
    try {
      await deleteInvoice(id);
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      await loadInvoices(); // Recharger pour mettre à jour les stats
      showSuccess('Succès', 'Facture supprimée');
    } catch (error: any) {
      console.error('Error deleting invoice:', error);
      showError('Erreur', 'Impossible de supprimer la facture');
    }
  };

  const validateInvoice = async (id: string) => {
    try {
      const validatedInvoice = await import('@/services/invoiceService').then(m => m.validateInvoice(id));
      setInvoices(prev => prev.map(inv => inv.id === id ? validatedInvoice : inv));
      await loadInvoices(); // Recharger pour mettre à jour les stats
      showSuccess('Succès', 'Facture validée et verrouillée');
      return validatedInvoice;
    } catch (error: any) {
      console.error('Error validating invoice:', error);
      showError('Erreur', 'Impossible de valider la facture');
      throw error;
    }
  };

  const getAnalytics = async (period: 'day' | 'week' | 'month' | 'year'): Promise<InvoiceAnalytics[]> => {
    try {
      return await getInvoiceAnalytics(mcardId, period);
    } catch (error: any) {
      console.error('Error loading analytics:', error);
      showError('Erreur', 'Impossible de charger les analytics');
      return [];
    }
  };

  useEffect(() => {
    if (mcardId) {
      loadInvoices();
    }
  }, [mcardId]);

  return {
    invoices,
    stats,
    loading,
    addInvoice,
    editInvoice,
    removeInvoice,
    validateInvoice,
    getAnalytics,
    refetch: loadInvoices
  };
};