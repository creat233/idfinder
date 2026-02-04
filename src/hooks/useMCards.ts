import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MCard, MCardCreateData, MCardUpdateData } from "@/types/mcard";
import { useAuthState } from "@/hooks/useAuthState";
import { useToast } from "@/hooks/use-toast";

export const useMCards = () => {
  const [mcards, setMCards] = useState<MCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthState();
  const { toast } = useToast();

  const fetchMCards = async () => {
    if (!user) {
      setMCards([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('mcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching MCards:', error);
        setError(error.message);
        setMCards([]);
      } else {
        setMCards(data || []);
      }
    } catch (err) {
      console.error('Error in fetchMCards:', err);
      setError('Une erreur inattendue s\'est produite');
      setMCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMCards();
  }, [user]);

  const createMCard = async (
    mcardData: MCardCreateData, 
    profilePictureFile: File | null = null,
    options?: { silent?: boolean }
  ): Promise<MCard | null> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une carte",
        variant: "destructive"
      });
      return null;
    }

    try {
      console.log('Creating MCard with data:', mcardData);
      
      let profile_picture_url = mcardData.profile_picture_url || null;
      
      // Upload profile picture if provided
      if (profilePictureFile) {
        const fileExt = profilePictureFile.name.split('.').pop();
        const fileName = `${user.id}/${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('mcard-profile-pictures')
          .upload(fileName, profilePictureFile);

        if (uploadError) {
          console.error('Error uploading profile picture:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('mcard-profile-pictures')
          .getPublicUrl(fileName);
          
        profile_picture_url = publicUrl;
      }

      // Create the mcard
      const { data, error } = await supabase
        .from('mcards')
        .insert({ 
          ...mcardData, 
          user_id: user.id,
          profile_picture_url 
        })
        .select()
        .single();

      if (error) throw error;
      
      // Send notification email for new MCard creation
      try {
        await supabase.functions.invoke('notify-new-mcard', {
          body: {
            mcardId: data.id,
            fullName: data.full_name,
            plan: data.plan,
            slug: data.slug,
            jobTitle: data.job_title,
            company: data.company,
            phoneNumber: data.phone_number,
            email: data.email,
            description: data.description,
            userId: user.id
          }
        });
        console.log('New MCard notification email sent');
      } catch (emailError) {
        // Don't fail the creation if email fails
        console.error('Failed to send notification email:', emailError);
      }
      
      await refetch();
      
      if (!options?.silent) {
        toast({
          title: "Carte créée !",
          description: `Votre carte ${mcardData.full_name} a été créée avec succès`,
        });
      }
      
      return data;
    } catch (error: any) {
      console.error('Error creating MCard:', error);
      
      if (!options?.silent) {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de la sauvegarde",
          variant: "destructive"
        });
      }
      
      throw error;
    }
  };

  const updateMCard = async (
    id: string, 
    updates: MCardUpdateData,
    profilePictureFile: File | null = null,
    originalCard: MCard
  ): Promise<MCard | null> => {
    try {
      let profile_picture_url = updates.profile_picture_url || originalCard.profile_picture_url;
      
      // Upload new profile picture if provided
      if (profilePictureFile) {
        const fileExt = profilePictureFile.name.split('.').pop();
        const fileName = `${user?.id}/${user?.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('mcard-profile-pictures')
          .upload(fileName, profilePictureFile);

        if (uploadError) {
          console.error('Error uploading profile picture:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('mcard-profile-pictures')
          .getPublicUrl(fileName);
          
        profile_picture_url = publicUrl;
      }

      const { data, error } = await supabase
        .from('mcards')
        .update({ ...updates, profile_picture_url })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      
      await refetch();
      
      toast({
        title: "Carte mise à jour !",
        description: "Vos modifications ont été enregistrées",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error updating MCard:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteMCard = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('mcards')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      await refetch();
    } catch (error) {
      console.error('Error deleting MCard:', error);
      throw error;
    }
  };

  const requestPlanUpgrade = async (mcardId: string, newPlan: string) => {
    // Cette fonction peut être implémentée selon vos besoins
    // Pour l'instant, elle ne fait rien
    console.log('Plan upgrade requested for:', mcardId, 'to:', newPlan);
  };

  const refetch = () => {
    fetchMCards();
  };

  return {
    mcards,
    loading,
    error,
    refetch,
    createMCard,
    updateMCard,
    deleteMCard,
    requestPlanUpgrade
  };
};