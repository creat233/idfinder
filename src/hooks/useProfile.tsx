import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const getProfile = async (session: any) => {
    try {
      setLoading(true);

      const userData = session.user.user_metadata;
      let profileData = {
        first_name: userData?.first_name || "",
        last_name: userData?.last_name || "",
        phone: userData?.phone || ""
      };

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone')
        .eq('id', session.user.id)
        .single();

      if (!profileError && profile) {
        profileData = {
          first_name: profile.first_name || profileData.first_name,
          last_name: profile.last_name || profileData.last_name,
          phone: profile.phone || profileData.phone
        };
      }

      setFirstName(profileData.first_name);
      setLastName(profileData.last_name);
      setPhone(profileData.phone);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger le profil",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (session: any) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          phone: phone,
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Numéro de téléphone mis à jour avec succès",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);
      setIsDeletingAccount(true);

      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ""
      );

      if (error) throw error;

      await supabase.auth.signOut();
      
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès",
      });
      
      navigate("/login");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer votre compte. Veuillez réessayer.",
      });
    } finally {
      setLoading(false);
      setIsDeletingAccount(false);
    }
  };

  return {
    loading,
    firstName,
    lastName,
    phone,
    isEditing,
    isDeletingAccount,
    setPhone,
    setIsEditing,
    setIsDeletingAccount,
    getProfile,
    updateProfile,
    deleteAccount
  };
};
