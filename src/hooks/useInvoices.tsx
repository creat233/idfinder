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
import { offlineStorage } from '@/services/offlineStorage';
import { useOfflineSync } from './useOfflineSync';

export const useInvoices = (mcardId: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();
  const { isOnline } = useOfflineSync();

  const loadInvoices = async () => {
    try {
      setLoading(true);
      
      // Mode hors ligne
      if (!isOnline) {
        const cachedInvoices = offlineStorage.getInvoices(mcardId);
        setInvoices(cachedInvoices);
        setLoading(false);
        return;
      }
      
      // Mode en ligne
      const [invoicesData, statsData] = await Promise.all([
        fetchInvoices(mcardId),
        getInvoiceStats(mcardId)
      ]);
      setInvoices(invoicesData);
      setStats(statsData);
      
      // Sauvegarder en cache
      offlineStorage.saveInvoices(mcardId, invoicesData);
    } catch (error: any) {
      console.error('Error loading invoices:', error);
      showError('Erreur', 'Impossible de charger les factures');
    } finally {
      setLoading(false);
    }
  };

  const addInvoice = async (invoiceData: InvoiceCreateData) => {
    const tempInvoice = {
      id: `temp_${Date.now()}`,
      ...invoiceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Invoice;

    // Ajouter immédiatement à l'état local
    setInvoices(prev => [tempInvoice, ...prev]);

    if (!isOnline) {
      // Mode hors ligne
      const updatedInvoices = [tempInvoice, ...invoices];
      offlineStorage.saveInvoices(mcardId, updatedInvoices);
      offlineStorage.addPendingChange({
        type: 'invoice',
        action: 'create',
        data: tempInvoice,
      });
      showSuccess('Succès', 'Facture créée (hors ligne)');
      return tempInvoice;
    }

    try {
      // Mode en ligne
      const newInvoice = await createInvoice(invoiceData);
      setInvoices(prev => prev.map(inv => inv.id === tempInvoice.id ? newInvoice : inv));
      await loadInvoices();
      showSuccess('Succès', 'Facture créée avec succès');
      return newInvoice;
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      showError('Erreur', 'Impossible de créer la facture');
      throw error;
    }
  };

  const editInvoice = async (id: string, updates: Partial<Invoice>) => {
    // Mettre à jour immédiatement l'état local
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));

    if (!isOnline) {
      // Mode hors ligne
      const updatedInvoices = invoices.map(inv => inv.id === id ? { ...inv, ...updates } : inv);
      offlineStorage.saveInvoices(mcardId, updatedInvoices);
      offlineStorage.addPendingChange({
        type: 'invoice',
        action: 'update',
        data: { id, ...updates },
      });
      showSuccess('Succès', 'Facture mise à jour (hors ligne)');
      return { ...invoices.find(inv => inv.id === id)!, ...updates };
    }

    try {
      const updatedInvoice = await updateInvoice(id, updates);
      setInvoices(prev => prev.map(inv => inv.id === id ? updatedInvoice : inv));
      await loadInvoices();
      showSuccess('Succès', 'Facture mise à jour');
      return updatedInvoice;
    } catch (error: any) {
      console.error('Error updating invoice:', error);
      showError('Erreur', 'Impossible de mettre à jour la facture');
      throw error;
    }
  };

  const removeInvoice = async (id: string) => {
    // Supprimer immédiatement de l'état local
    setInvoices(prev => prev.filter(inv => inv.id !== id));

    if (!isOnline) {
      // Mode hors ligne
      const updatedInvoices = invoices.filter(inv => inv.id !== id);
      offlineStorage.saveInvoices(mcardId, updatedInvoices);
      offlineStorage.addPendingChange({
        type: 'invoice',
        action: 'delete',
        data: { id },
      });
      showSuccess('Succès', 'Facture supprimée (hors ligne)');
      return;
    }

    try {
      await deleteInvoice(id);
      await loadInvoices();
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