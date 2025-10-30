import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { offlineStorage, PendingChange } from '@/services/offlineStorage';
import { useToast } from '@/hooks/useToast';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingChangesCount, setPendingChangesCount] = useState(0);
  const { showSuccess, showError, showInfo } = useToast();

  // Détecter les changements de connexion
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showInfo('Connexion rétablie', 'Synchronisation en cours...');
      syncPendingChanges();
    };

    const handleOffline = () => {
      setIsOnline(false);
      showInfo('Mode hors ligne', 'Vos modifications seront synchronisées automatiquement');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier périodiquement la connexion Supabase
    const interval = setInterval(async () => {
      try {
        await supabase.from('profiles').select('count').limit(1);
        if (!isOnline) {
          setIsOnline(true);
          syncPendingChanges();
        }
      } catch (error) {
        if (isOnline) {
          setIsOnline(false);
        }
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline]);

  // Mettre à jour le compteur de modifications en attente
  useEffect(() => {
    const updateCount = () => {
      setPendingChangesCount(offlineStorage.getPendingChanges().length);
    };
    
    updateCount();
    const interval = setInterval(updateCount, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const syncPendingChanges = useCallback(async () => {
    if (isSyncing || !isOnline) return;

    const changes = offlineStorage.getPendingChanges();
    if (changes.length === 0) return;

    setIsSyncing(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const change of changes) {
        try {
          await syncSingleChange(change);
          offlineStorage.removePendingChange(change.id);
          successCount++;
        } catch (error) {
          console.error('Erreur lors de la synchronisation:', error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        offlineStorage.setLastSync(Date.now());
        showSuccess(
          'Synchronisation réussie',
          `${successCount} modification(s) synchronisée(s)`
        );
      }

      if (errorCount > 0) {
        showError(
          'Erreur de synchronisation',
          `${errorCount} modification(s) n'ont pas pu être synchronisées`
        );
      }

      setPendingChangesCount(offlineStorage.getPendingChanges().length);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, isOnline]);

  const syncSingleChange = async (change: PendingChange) => {
    const { type, action, data } = change;

    switch (type) {
      case 'mcard':
        if (action === 'create') {
          await supabase.from('mcards').insert(data);
        } else if (action === 'update') {
          await supabase.from('mcards').update(data).eq('id', data.id);
        } else if (action === 'delete') {
          await supabase.from('mcards').delete().eq('id', data.id);
        }
        break;

      case 'status':
        if (action === 'create') {
          await supabase.from('mcard_statuses').insert(data);
        } else if (action === 'update') {
          await supabase.from('mcard_statuses').update(data).eq('id', data.id);
        } else if (action === 'delete') {
          await supabase.from('mcard_statuses').delete().eq('id', data.id);
        }
        break;

      case 'product':
        if (action === 'create') {
          await supabase.from('mcard_products').insert(data);
        } else if (action === 'update') {
          await supabase.from('mcard_products').update(data).eq('id', data.id);
        } else if (action === 'delete') {
          await supabase.from('mcard_products').delete().eq('id', data.id);
        }
        break;

      case 'review':
        if (action === 'create') {
          await supabase.from('mcard_reviews').insert(data);
        }
        break;

      case 'reported_card':
        if (action === 'create') {
          await supabase.from('reported_cards').insert(data);
        } else if (action === 'update') {
          await supabase.from('reported_cards').update(data).eq('id', data.id);
        }
        break;

      case 'user_card':
        if (action === 'create') {
          await supabase.from('user_cards').insert(data);
        } else if (action === 'update') {
          await supabase.from('user_cards').update(data).eq('id', data.id);
        } else if (action === 'delete') {
          await supabase.from('user_cards').delete().eq('id', data.id);
        }
        break;
    }
  };

  const forceSyncNow = useCallback(() => {
    if (isOnline) {
      syncPendingChanges();
    } else {
      showError('Pas de connexion', 'Impossible de synchroniser sans connexion internet');
    }
  }, [isOnline, syncPendingChanges]);

  return {
    isOnline,
    isSyncing,
    pendingChangesCount,
    syncPendingChanges,
    forceSyncNow,
  };
};
