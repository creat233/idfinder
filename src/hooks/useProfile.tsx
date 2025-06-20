
import { useState, useCallback } from "react";
import { useProfileData } from "./useProfileData";
import { useProfileSettings } from "./useProfileSettings";

export const useProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const {
    loading: profileLoading,
    firstName,
    lastName,
    phone,
    country,
    totalEarnings,
    setPhone,
    getProfile: getProfileData,
    updateProfile: updateProfileData
  } = useProfileData();

  const {
    loading: settingsLoading,
    isOnVacation,
    enableSecurityNotifications,
    getProfileSettings,
    updateNotificationSettings
  } = useProfileSettings();

  const loading = profileLoading || settingsLoading;

  const getProfile = useCallback(async (session: any) => {
    if (!session?.user?.id || initialized) {
      return;
    }
    
    console.log('🔄 Chargement unique du profil et des paramètres...');
    setInitialized(true);
    
    try {
      await Promise.all([
        getProfileData(session),
        getProfileSettings(session)
      ]);
    } catch (error) {
      console.error('❌ Erreur lors du chargement du profil:', error);
      setInitialized(false);
    }
  }, [getProfileData, getProfileSettings, initialized]);

  const updateProfile = useCallback(async (session: any) => {
    if (!session?.user?.id) {
      console.warn('❌ Aucune session utilisateur valide pour la mise à jour');
      return;
    }
    
    await updateProfileData(session, phone, country);
    setIsEditing(false);
  }, [updateProfileData, phone, country]);

  const onVacationModeChange = useCallback((checked: boolean) => {
    updateNotificationSettings({ isOnVacation: checked });
  }, [updateNotificationSettings]);

  const onSecurityNotificationsChange = useCallback((checked: boolean) => {
    updateNotificationSettings({ enableSecurityNotifications: checked });
  }, [updateNotificationSettings]);

  return {
    loading,
    firstName,
    lastName,
    phone,
    country,
    isEditing,
    totalEarnings,
    isOnVacation,
    enableSecurityNotifications,
    setPhone,
    setIsEditing,
    getProfile,
    updateProfile,
    onVacationModeChange,
    onSecurityNotificationsChange
  };
};
