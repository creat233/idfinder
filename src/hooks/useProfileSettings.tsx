
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";

export const useProfileSettings = () => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [isOnVacation, setIsOnVacation] = useState(false);
  const [enableSecurityNotifications, setEnableSecurityNotifications] = useState(true);

  const getProfileSettings = useCallback(async (session: any) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_on_vacation, enable_security_notifications')
        .eq('id', session.user.id)
        .single();

      if (!error && profile) {
        setIsOnVacation(profile.is_on_vacation ?? false);
        setEnableSecurityNotifications(profile.enable_security_notifications ?? true);
      }
    } catch (error) {
      console.error('Error loading profile settings:', error);
    }
  }, []);

  const updateNotificationSettings = useCallback(async (settings: { isOnVacation?: boolean; enableSecurityNotifications?: boolean }) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non trouvé");

      const updates: { is_on_vacation?: boolean; enable_security_notifications?: boolean } = {};

      if (settings.isOnVacation !== undefined) {
        updates.is_on_vacation = settings.isOnVacation;
      }
      if (settings.enableSecurityNotifications !== undefined) {
        updates.enable_security_notifications = settings.enableSecurityNotifications;
      }

      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;

      if (settings.isOnVacation !== undefined) {
        setIsOnVacation(settings.isOnVacation);
      }
      if (settings.enableSecurityNotifications !== undefined) {
        setEnableSecurityNotifications(settings.enableSecurityNotifications);
      }

      showSuccess("Succès", "Préférences de notification mises à jour.");
    } catch (error) {
      console.error('Error updating notification settings:', error);
      showError("Erreur", "Impossible de mettre à jour les préférences.");
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  return {
    loading,
    isOnVacation,
    enableSecurityNotifications,
    getProfileSettings,
    updateNotificationSettings
  };
};
