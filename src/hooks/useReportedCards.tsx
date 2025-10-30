import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';
import { offlineStorage } from '@/services/offlineStorage';
import { useOfflineSync } from './useOfflineSync';

interface ReportedCard {
  id: string;
  card_number: string;
  document_type: string;
  description?: string;
  location?: string;
  photo_url?: string;
  status?: string;
  reporter_id?: string;
  reporter_phone?: string;
  created_at: string;
  recovery_price?: number;
  recovery_final_price?: number;
  recovery_currency?: string;
  recovery_currency_symbol?: string;
  promo_code_id?: string;
}

export const useReportedCards = () => {
  const [cards, setCards] = useState<ReportedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();
  const { isOnline } = useOfflineSync();

  const fetchCards = async () => {
    try {
      // Mode hors ligne : charger depuis le cache
      if (!isOnline) {
        const cachedCards = offlineStorage.getAllReportedCards();
        setCards(cachedCards);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('reported_cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reportedCards = data || [];
      setCards(reportedCards);

      // Sauvegarder dans le cache
      reportedCards.forEach(card => offlineStorage.saveReportedCard(card));
    } catch (error) {
      console.error('Error fetching reported cards:', error);

      // En cas d'erreur, essayer de charger depuis le cache
      const cachedCards = offlineStorage.getAllReportedCards();
      if (cachedCards.length > 0) {
        setCards(cachedCards);
      } else {
        showError('Erreur', 'Impossible de récupérer les cartes signalées');
      }
    } finally {
      setLoading(false);
    }
  };

  const reportCard = async (cardData: {
    card_number: string;
    document_type: string;
    description?: string;
    location: string;
    found_date: string;
    photo_url?: string;
    recovery_price?: number;
    recovery_final_price?: number;
    recovery_currency?: string;
    recovery_currency_symbol?: string;
    promo_code_id?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const newCard = {
        id: `temp_${Date.now()}`,
        ...cardData,
        reporter_id: user.id,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      if (!isOnline) {
        // Mode hors ligne : sauvegarder localement
        offlineStorage.saveReportedCard(newCard);
        offlineStorage.addPendingChange({
          type: 'reported_card',
          action: 'create',
          data: newCard,
        });

        setCards(prev => [newCard, ...prev]);
        showSuccess('Carte signalée (hors ligne)', 'Sera synchronisée à la reconnexion');
        return newCard;
      }

      const { data, error } = await supabase
        .from('reported_cards')
        .insert([{
          card_number: cardData.card_number,
          document_type: cardData.document_type,
          description: cardData.description,
          location: cardData.location,
          found_date: cardData.found_date,
          photo_url: cardData.photo_url,
          recovery_final_price: cardData.recovery_final_price,
          recovery_currency: cardData.recovery_currency,
          recovery_currency_symbol: cardData.recovery_currency_symbol,
          promo_code_id: cardData.promo_code_id,
          reporter_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        offlineStorage.saveReportedCard(data);
        fetchCards();
        showSuccess('Carte signalée', 'Votre signalement a été enregistré');
        return data;
      }
    } catch (error: any) {
      console.error('Error reporting card:', error);
      showError('Erreur', 'Impossible de signaler la carte');
      throw error;
    }
  };

  const updateCardStatus = async (cardId: string, status: string) => {
    try {
      const updatedData = { id: cardId, status };

      if (!isOnline) {
        // Mode hors ligne
        const card = offlineStorage.getReportedCard(cardId);
        if (card) {
          const updated = { ...card, status };
          offlineStorage.saveReportedCard(updated);
          offlineStorage.addPendingChange({
            type: 'reported_card',
            action: 'update',
            data: updatedData,
          });

          setCards(prev => prev.map(c => c.id === cardId ? updated : c));
          showSuccess('Statut mis à jour (hors ligne)', 'Sera synchronisé à la reconnexion');
        }
        return;
      }

      const { error } = await supabase
        .from('reported_cards')
        .update({ status })
        .eq('id', cardId);

      if (error) throw error;

      const card = offlineStorage.getReportedCard(cardId);
      if (card) {
        offlineStorage.saveReportedCard({ ...card, status });
      }

      fetchCards();
      showSuccess('Statut mis à jour', 'Le statut de la carte a été modifié');
    } catch (error) {
      console.error('Error updating card status:', error);
      showError('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  useEffect(() => {
    fetchCards();
  }, [isOnline]);

  return {
    cards,
    loading,
    reportCard,
    updateCardStatus,
    refetch: fetchCards,
  };
};
