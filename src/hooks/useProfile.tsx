
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { detectCountryFromPhone } from "@/utils/countryUtils";

export const useProfile = () => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("SN");
  const [isEditing, setIsEditing] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isOnVacation, setIsOnVacation] = useState(false);
  const [enableSecurityNotifications, setEnableSecurityNotifications] = useState(true);

  const getProfile = useCallback(async (session: any) => {
    try {
      setLoading(true);

      const userData = session.user.user_metadata;
      let profileData: any = {
        first_name: userData?.first_name || "",
        last_name: userData?.last_name || "",
        phone: userData?.phone || "",
        country: userData?.country || "SN"
      };

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, country, is_on_vacation, enable_security_notifications')
        .eq('id', session.user.id)
        .single();

      if (!profileError && profile) {
        profileData = {
          first_name: profile.first_name || profileData.first_name,
          last_name: profile.last_name || profileData.last_name,
          phone: profile.phone || profileData.phone,
          country: profile.country || profileData.country,
          is_on_vacation: profile.is_on_vacation,
          enable_security_notifications: profile.enable_security_notifications
        };
      }

      setFirstName(profileData.first_name);
      setLastName(profileData.last_name);
      setPhone(profileData.phone);
      setIsOnVacation(profileData.is_on_vacation ?? false);
      setEnableSecurityNotifications(profileData.enable_security_notifications ?? true);
      
      // Fetch total earnings from promo codes
      const { data: promoData, error: promoError } = await supabase
        .from('promo_codes')
        .select('total_earnings')
        .eq('user_id', session.user.id);

      if (!promoError && promoData) {
        const earnings = promoData.reduce((acc, code) => acc + (code.total_earnings || 0), 0);
        setTotalEarnings(earnings);
      }
      
      // Détecter automatiquement le pays à partir du numéro de téléphone
      if (profileData.phone) {
        const detectedCountry = detectCountryFromPhone(profileData.phone);
        setCountry(detectedCountry);
        
        // Mettre à jour le pays dans la base de données si différent
        if (detectedCountry !== profileData.country) {
          await supabase
            .from('profiles')
            .update({ country: detectedCountry })
            .eq('id', session.user.id);
        }
      } else {
        setCountry(profileData.country);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      showError("Erreur", "Impossible de charger le profil");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const updateProfile = useCallback(async (session: any) => {
    try {
      setLoading(true);

      // Détecter le pays à partir du nouveau numéro de téléphone
      const detectedCountry = phone ? detectCountryFromPhone(phone) : country;

      const { error } = await supabase
        .from('profiles')
        .update({
          phone: phone,
          country: detectedCountry
        })
        .eq('id', session.user.id);

      if (error) throw error;

      setCountry(detectedCountry);
      showSuccess("Succès", "Profil mis à jour avec succès");
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showError("Erreur", "Impossible de mettre à jour le profil");
    } finally {
      setLoading(false);
    }
  }, [phone, country, showError, showSuccess]);

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
    updateNotificationSettings
  };
};
