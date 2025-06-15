import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

export const useAuth = () => {
  const navigate = useNavigate();
  const mounted = useRef(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const onRegister = async (values: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      // Valider que tous les champs obligatoires sont remplis
      if (!values.firstName.trim() || !values.lastName.trim() || !values.phone.trim()) {
        setError(t('register_error_all_fields'));
        return false;
      }

      // Valider le format du téléphone
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
      if (!phoneRegex.test(values.phone)) {
        setError(t('register_error_phone_invalid'));
        return false;
      }

      console.log("🔄 Inscription avec les données:", {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        country: values.country
      });

      // Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName.trim(),
            last_name: values.lastName.trim(),
            phone: values.phone.trim(),
            country: values.country,
          },
        },
      });

      if (authError) {
        console.error("❌ Erreur d'authentification:", authError);
        setError(authError.message);
        return false;
      }

      // Insert or update profile data explicitly to ensure it's saved
      if (authData?.user) {
        console.log("💾 Sauvegarde du profil utilisateur...");
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            first_name: values.firstName.trim(),
            last_name: values.lastName.trim(),
            phone: values.phone.trim(),
            country: values.country
          });

        if (profileError) {
          console.error("❌ Erreur de sauvegarde du profil:", profileError);
          // Don't fail registration if profile update fails, but show warning
          toast({
            variant: "destructive",
            title: t('auth_hook_profile_error_toast_title'),
            description: t('auth_hook_profile_error_toast_desc'),
          });
        } else {
          console.log("✅ Profil sauvegardé avec succès");
        }
      }

      toast({
        title: t('auth_hook_account_created_toast_title'),
        description: t('auth_hook_account_created_toast_desc'),
      });
      
      return true;
    } catch (err) {
      console.error("💥 Erreur d'inscription:", err);
      setError(t('register_error_generic'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(error.message);
        return false;
      }

      navigate("/");
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError(t('login_general_error'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (values: { email: string }) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        setError(error.message);
        return false;
      }

      toast({
        title: t('reset_password_success_toast_title'),
        description: t('reset_password_success_toast_desc'),
      });
      
      return true;
    } catch (err) {
      console.error("Password reset error:", err);
      setError(t('reset_password_error_generic'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && mounted.current) {
        navigate("/");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user.created_at === session?.user.last_sign_in_at) {
        toast({
          title: t('auth_hook_account_created_toast_title'),
          description: t('auth_hook_signed_in_toast_desc'),
        });
      } else if (event === 'SIGNED_IN') {
        if (mounted.current) {
          navigate("/");
        }
      } else if (event === 'USER_UPDATED') {
        toast({
          variant: "destructive",
          title: t('auth_hook_user_exists_toast_title'),
          description: t('auth_hook_user_exists_toast_desc'),
        });
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: t('auth_hook_password_recovery_toast_title'),
          description: t('auth_hook_password_recovery_toast_desc'),
        });
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [navigate, t]);

  return {
    loading,
    error,
    onLogin,
    onRegister,
    onResetPassword,
    setError
  };
};
