
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminPermissions = () => {
  const [hasActivationPermission, setHasActivationPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setHasActivationPermission(false);
          setLoading(false);
          return;
        }

        // Vérifier si l'utilisateur a la permission d'activation
        const { data, error } = await supabase.rpc('can_activate_promo_codes', {
          user_email: user.email
        });

        if (error) {
          console.error("Error checking permissions:", error);
          setHasActivationPermission(false);
        } else {
          setHasActivationPermission(data || false);
        }
      } catch (error) {
        console.error("Error checking admin permissions:", error);
        setHasActivationPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, []);

  return {
    hasActivationPermission,
    loading
  };
};
