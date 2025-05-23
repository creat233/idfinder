
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuth = () => {
  const navigate = useNavigate();
  const mounted = useRef(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onRegister = async (values: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      // Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            phone: values.phone,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return false;
      }

      // Insert or update profile data explicitly to ensure it's saved
      if (authData?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            first_name: values.firstName,
            last_name: values.lastName,
            phone: values.phone
          });

        if (profileError) {
          console.error("Profile update error:", profileError);
          // Don't fail registration if profile update fails
        }
      }

      toast({
        title: "Compte créé avec succès",
        description: "Vous pouvez maintenant vous connecter",
      });
      
      return true;
    } catch (err) {
      console.error("Registration error:", err);
      setError("Une erreur s'est produite lors de l'inscription");
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
      setError("Une erreur s'est produite lors de la connexion");
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
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });
      
      return true;
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Une erreur s'est produite lors de l'envoi de l'email");
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
          title: "Compte créé avec succès",
          description: "Vous pouvez maintenant vous connecter",
        });
      } else if (event === 'SIGNED_IN') {
        if (mounted.current) {
          navigate("/");
        }
      } else if (event === 'USER_UPDATED') {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "L'utilisateur existe déjà. Veuillez vous connecter.",
        });
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Réinitialisation du mot de passe",
          description: "Veuillez suivre les instructions pour réinitialiser votre mot de passe",
        });
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return {
    loading,
    error,
    onLogin,
    onRegister,
    onResetPassword,
    setError
  };
};
