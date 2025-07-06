import { supabase } from '@/integrations/supabase/client';
import { MCardVerificationRequest, VerificationFormData } from '@/types/mcard-verification';

export const createVerificationRequest = async (
  mcardId: string,
  formData: VerificationFormData
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    // Upload des documents
    const idDocumentPath = `${user.id}/id-${Date.now()}.${formData.id_document.name.split('.').pop()}`;
    
    const { error: idUploadError } = await supabase.storage
      .from('verification-documents')
      .upload(idDocumentPath, formData.id_document);

    if (idUploadError) throw idUploadError;

    let nineaDocumentPath = null;
    if (formData.ninea_document) {
      nineaDocumentPath = `${user.id}/ninea-${Date.now()}.${formData.ninea_document.name.split('.').pop()}`;
      
      const { error: nineaUploadError } = await supabase.storage
        .from('verification-documents')
        .upload(nineaDocumentPath, formData.ninea_document);

      if (nineaUploadError) throw nineaUploadError;
    }

    // Créer la demande de vérification
    const { error: insertError } = await supabase
      .from('mcard_verification_requests')
      .insert({
        mcard_id: mcardId,
        user_id: user.id,
        id_document_url: idDocumentPath,
        ninea_document_url: nineaDocumentPath,
        payment_status: formData.payment_confirmed ? 'paid' : 'pending'
      });

    if (insertError) throw insertError;

    // Mettre à jour le statut de vérification de la MCard
    const { error: updateError } = await supabase
      .from('mcards')
      .update({ verification_status: 'pending' })
      .eq('id', mcardId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error: any) {
    console.error('Erreur lors de la création de la demande:', error);
    return { success: false, error: error.message };
  }
};

export const getVerificationRequests = async (): Promise<MCardVerificationRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('mcard_verification_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    return [];
  }
};

export const getUserVerificationStatus = async (mcardId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('mcard_verification_requests')
      .select('status')
      .eq('mcard_id', mcardId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.status || null;
  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error);
    return null;
  }
};