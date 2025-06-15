
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from './useTranslation';

export const usePasswordUpdate = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  const updatePassword = async (password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showSuccess(t('passwordUpdatedSuccess') || 'Succès', 'Votre mot de passe a été mis à jour.');
      return true;
    } catch (error: any) {
      console.error('Error updating password:', error);
      showError(t('passwordUpdateError') || 'Erreur', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, updatePassword };
};
