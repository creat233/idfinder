
import { supabase } from "@/integrations/supabase/client";
import { PromoCodeData } from "@/types/promo";

// Interface pour les données retournées par la RPC (avec les types string pour éviter les conflits)
interface AdminPromoRPCResponse {
  id: string;
  user_id: string;
  code: string;
  is_active: boolean;
  is_paid: boolean;
  created_at: string;
  expires_at: string;
  total_earnings: number;
  usage_count: number;
  user_email: string;
  user_name: string;
  user_phone: string;
}

export class AdminPromoService {
  static async checkUserPermissions(): Promise<boolean> {
    console.log("🔐 Vérification des permissions admin...");
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("❌ Utilisateur non connecté");
      return false;
    }

    console.log("👤 Utilisateur connecté:", user.email);

    const { data: hasPermission, error: permError } = await supabase
      .rpc('can_activate_promo_codes', { user_email: user.email });

    console.log("🔐 Résultat permissions:", { hasPermission, permError });

    if (permError) {
      console.error("❌ Erreur vérification permissions:", permError);
      throw new Error(`Erreur permissions: ${permError.message}`);
    }

    if (!hasPermission) {
      console.warn("⚠️ Utilisateur sans permissions admin");
      throw new Error("Accès refusé - Permissions d'administrateur requises");
    }

    console.log("✅ Permissions admin confirmées");
    return true;
  }

  static async getAllPromoCodes(): Promise<PromoCodeData[]> {
    await this.checkUserPermissions();

    console.log("🔄 Appel de la fonction RPC admin_get_all_promo_codes...");
    
    const { data: codesData, error: codesError } = await supabase
      .rpc('admin_get_all_promo_codes');

    console.log("📊 Réponse RPC complète:", { codesData, codesError });

    if (codesError) {
      console.error("❌ Erreur fonction RPC:", codesError);
      throw codesError;
    }

    if (!codesData || codesData.length === 0) {
      console.log("⚠️ Aucun code promo trouvé via RPC");
      return [];
    }

    console.log("📊 Données brutes reçues de la RPC:", codesData.length, "codes");
    console.log("📊 Premier élément:", codesData[0]);

    // Transformer les données en vérifiant l'expiration
    const now = new Date();
    const transformedData: PromoCodeData[] = codesData.map((code: AdminPromoRPCResponse) => {
      const expiresAt = new Date(code.expires_at);
      const isExpired = expiresAt < now;
      
      return {
        id: code.id,
        code: code.code,
        is_active: Boolean(code.is_active) && !isExpired, // Désactiver si expiré
        is_paid: Boolean(code.is_paid),
        created_at: code.created_at,
        expires_at: code.expires_at,
        total_earnings: Number(code.total_earnings) || 0,
        usage_count: Number(code.usage_count) || 0,
        user_id: code.user_id,
        user_email: code.user_email,
        user_name: code.user_name,
        user_phone: code.user_phone
      };
    });

    console.log("✅ Données transformées:", transformedData.length, "codes promo");
    return transformedData;
  }

  static async processExpiredCodes(): Promise<void> {
    await this.checkUserPermissions();
    
    console.log("🔄 Traitement des codes expirés...");
    
    try {
      const { error } = await supabase.rpc('notify_expired_promo_codes');
      
      if (error) {
        console.error("❌ Erreur traitement codes expirés:", error);
        throw error;
      }
      
      console.log("✅ Codes expirés traités avec succès");
    } catch (error) {
      console.error("❌ Erreur processExpiredCodes:", error);
      throw error;
    }
  }
}
