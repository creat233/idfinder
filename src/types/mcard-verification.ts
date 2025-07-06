export type MCardVerificationRequest = {
  id: string;
  mcard_id: string;
  user_id: string;
  id_document_url: string;
  ninea_document_url?: string;
  payment_status: string;
  verification_fee: number;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
};

export type MCardInteraction = {
  id: string;
  user_id: string;
  mcard_id: string;
  interaction_type: 'like' | 'favorite';
  created_at: string;
};

export type MCardMessage = {
  id: string;
  sender_id: string;
  recipient_id: string;
  mcard_id: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender_name?: string;
  recipient_name?: string;
  mcard_name?: string;
};

export type VerificationFormData = {
  id_document: File;
  ninea_document?: File;
  payment_confirmed: boolean;
};