
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./useToast";
import { AdminPermission } from "@/types/adminPermission";

export const useAdminPermissionsManager = () => {
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchPermissions = useCallback(async () => {
    console.log('🔄 Chargement des permissions admin...');
    setLoading(true);
    
    try {
      // Vérifier d'abord si l'utilisateur est admin
      const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin');
      
      if (adminError) {
        console.error('❌ Erreur vérification admin:', adminError);
        throw adminError;
      }
      
      if (!isAdminData) {
        console.warn('⚠️ Utilisateur non-admin essayant d\'accéder aux permissions');
        setPermissions([]);
        setLoading(false);
        return;
      }
      
      console.log('✅ Utilisateur admin confirmé, récupération des permissions...');
      
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur récupération permissions:', error);
        throw error;
      }
      
      console.log('✅ Permissions récupérées:', data?.length || 0, 'éléments');
      setPermissions(data || []);
      
    } catch (error: any) {
      console.error('❌ Erreur dans fetchPermissions:', error);
      showError("Erreur", "Impossible de charger les permissions administrateur.");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    console.log('🚀 Initialisation useAdminPermissionsManager');
    fetchPermissions();
  }, [fetchPermissions]);

  return { permissions, loading, refetch: fetchPermissions };
};
