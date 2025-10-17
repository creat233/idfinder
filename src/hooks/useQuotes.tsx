import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Quote, QuoteCreateData } from '@/types/quote';

export const useQuotes = (mcardId: string) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    try {
      const quoteNumber = generateQuoteNumber();
      const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

      // Séparer les items des autres données
      const { items, ...quoteFields } = data;

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
