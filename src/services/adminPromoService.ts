
import { supabase } from "@/integrations/supabase/client";
import { PromoCodeData } from "@/types/promo";

// Interface pour les données brutes retournées par la RPC
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

  static async fetchPromoCodesViaRPC(): Promise<PromoCodeData[]> {
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

    console.log("📊 Données brutes reçues de la RPC:", codesData);
    console.log("📊 Premier élément:", codesData[0]);

    return this.transformRPCData(codesData || []);
  }

  static async fetchPromoCodesFallback(): Promise<PromoCodeData[]> {
    console.log("🔄 Fallback: requête directe sur promo_codes...");
    
    const { data: codesData, error: codesError } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("📊 Codes bruts récupérés (fallback):", codesData?.length);

    if (codesError) {
      console.error("❌ Erreur récupération codes (fallback):", codesError);
      throw codesError;
    }

    if (!codesData || codesData.length === 0) {
      console.log("⚠️ Aucun code promo trouvé en fallback");
      return [];
    }

    // Récupérer les profils séparément
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, phone");

    console.log("📊 Profils récupérés:", profilesData?.length);

    // Créer un map des profils
    const profilesMap = new Map();
    if (profilesData) {
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
    }

    return this.transformFallbackData(codesData || [], profilesMap);
  }

  private static transformRPCData(codesData: AdminPromoRPCResponse[]): PromoCodeData[] {
    console.log("🔄 Transformation des données RPC...");
    return codesData.map(code => {
      console.log("🔄 Traitement code:", code);
      const transformed = {
        id: code.id,
        code: code.code,
        is_active: Boolean(code.is_active),
        is_paid: Boolean(code.is_paid),
        created_at: code.created_at,
        expires_at: code.expires_at,
        total_earnings: Number(code.total_earnings) || 0,
        usage_count: Number(code.usage_count) || 0,
        user_id: code.user_id,
        user_email: code.user_email || `user-${code.user_id.slice(0, 8)}@finderid.com`,
        user_name: code.user_name || `Utilisateur ${code.user_id.slice(0, 8)}`,
        user_phone: code.user_phone || "Non renseigné"
      };
      console.log("✅ Code transformé:", transformed);
      return transformed;
    });
  }

  private static transformFallbackData(codesData: any[], profilesMap: Map<string, any>): PromoCodeData[] {
    console.log("🔄 Transformation des données fallback...");
    return codesData.map(code => {
      const profile = profilesMap.get(code.user_id);
      const transformed = {
        id: code.id,
        code: code.code,
        is_active: Boolean(code.is_active),
        is_paid: Boolean(code.is_paid),
        created_at: code.created_at,
        expires_at: code.expires_at,
        total_earnings: Number(code.total_earnings) || 0,
        usage_count: Number(code.usage_count) || 0,
        user_id: code.user_id,
        user_email: profile ? `${profile.first_name}@finderid.com` : `user-${code.user_id.slice(0, 8)}@finderid.com`,
        user_name: profile ? `${profile.first_name} ${profile.last_name || ''}`.trim() : `Utilisateur ${code.user_id.slice(0, 8)}`,
        user_phone: profile?.phone || "Non renseigné"
      };
      console.log("✅ Code fallback transformé:", transformed);
      return transformed;
    });
  }

  static async getAllPromoCodes(): Promise<PromoCodeData[]> {
    await this.checkUserPermissions();

    try {
      const rpcResult = await this.fetchPromoCodesViaRPC();
      console.log("✅ Résultat RPC final:", rpcResult.length, "codes trouvés");
      return rpcResult;
    } catch (rpcError) {
      console.warn("⚠️ Échec RPC, tentative de fallback:", rpcError);
      const fallbackResult = await this.fetchPromoCodesFallback();
      console.log("✅ Résultat Fallback final:", fallbackResult.length, "codes trouvés");
      return fallbackResult;
    }
  }
}
