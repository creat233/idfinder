import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Quote, QuoteCreateData } from '@/types/quote';
import { offlineStorage } from '@/services/offlineStorage';
import { useOfflineSync } from './useOfflineSync';

export const useQuotes = (mcardId: string) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isOnline } = useOfflineSync();

  const generateQuoteNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `DEVIS-${year}${month}-${random}`;
  };

  const loadQuotes = async () => {
    if (!mcardId) return;
    
    try {
      setLoading(true);
      
      // Mode hors ligne
      if (!isOnline) {
        const cachedQuotes = offlineStorage.getQuotes(mcardId);
        setQuotes(cachedQuotes);
        setLoading(false);
        return;
      }
      
      // Mode en ligne
      const { data: quotesData, error: quotesError } = await supabase
        .from('mcard_quotes')
        .select('*')
        .eq('mcard_id', mcardId)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      const quotesWithItems = await Promise.all(
        (quotesData || []).map(async (quote) => {
          const { data: itemsData } = await supabase
            .from('mcard_quote_items')
            .select('*')
            .eq('quote_id', quote.id);
          
          return {
            ...quote,
            items: itemsData || []
          };
        })
      );

      setQuotes(quotesWithItems);
      
      // Sauvegarder en cache
      offlineStorage.saveQuotes(mcardId, quotesWithItems);
    } catch (error) {
      console.error('Erreur lors du chargement des devis:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les devis'
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuote = async (data: QuoteCreateData) => {
    const quoteNumber = generateQuoteNumber();
    const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const { items, ...quoteFields } = data;

    const tempQuote = {
      id: `temp_${Date.now()}`,
      ...quoteFields,
      quote_number: quoteNumber,
      amount: totalAmount,
      items,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Quote;

    // Ajouter immédiatement à l'état local
    setQuotes(prev => [tempQuote, ...prev]);

    if (!isOnline) {
      // Mode hors ligne
      const updatedQuotes = [tempQuote, ...quotes];
      offlineStorage.saveQuotes(mcardId, updatedQuotes);
      offlineStorage.addPendingChange({
        type: 'quote',
        action: 'create',
        data: tempQuote,
      });
      toast({
        title: 'Succès',
        description: 'Devis créé (hors ligne)'
      });
      return;
    }

    try {
      // Mode en ligne
      const { data: quoteData, error: quoteError } = await supabase
        .from('mcard_quotes')
        .insert({
          ...quoteFields,
          quote_number: quoteNumber,
          amount: totalAmount
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      const itemsToInsert = items.map(item => ({
        quote_id: quoteData.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
      }));

      const { error: itemsError } = await supabase
        .from('mcard_quote_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast({
        title: 'Succès',
        description: 'Devis créé avec succès'
      });

      await loadQuotes();
    } catch (error) {
      console.error('Erreur lors de la création du devis:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de créer le devis'
      });
    }
  };

  const deleteQuote = async (quoteId: string) => {
    // Supprimer immédiatement de l'état local
    setQuotes(prev => prev.filter(q => q.id !== quoteId));

    if (!isOnline) {
      // Mode hors ligne
      const updatedQuotes = quotes.filter(q => q.id !== quoteId);
      offlineStorage.saveQuotes(mcardId, updatedQuotes);
      offlineStorage.addPendingChange({
        type: 'quote',
        action: 'delete',
        data: { id: quoteId },
      });
      toast({
        title: 'Succès',
        description: 'Devis supprimé (hors ligne)'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('mcard_quotes')
        .delete()
        .eq('id', quoteId);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Devis supprimé avec succès'
      });

      await loadQuotes();
    } catch (error) {
      console.error('Erreur lors de la suppression du devis:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer le devis'
      });
    }
  };

  useEffect(() => {
    loadQuotes();
  }, [mcardId]);

  return {
    quotes,
    loading,
    addQuote,
    deleteQuote,
    loadQuotes
  };
};
