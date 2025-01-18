import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      }
      if (event === 'USER_UPDATED') {
        supabase.auth.getSession().then(({ error }) => {
          if (error) {
            setError(getErrorMessage(error));
          } else {
            setError(null);
          }
        });
      }
      if (event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    console.log("Auth error:", error);
    
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case 'over_email_send_rate_limit':
          return "Pour des raisons de sécurité, veuillez attendre quelques secondes avant de réessayer.";
        case 'invalid_credentials':
          return "Email ou mot de passe incorrect. Veuillez vérifier vos informations.";
        case 'email_not_confirmed':
          return "Veuillez vérifier votre email avant de vous connecter.";
        case 'user_not_found':
          return "Aucun utilisateur trouvé avec ces identifiants.";
        case 'invalid_grant':
          return "Identifiants de connexion invalides.";
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-8">Bienvenue</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#3B82F6',
                  brandAccent: '#2563EB',
                }
              }
            }
          }}
          theme="light"
          providers={[]}
        />
      </motion.div>
    </div>
  );
};

export default Login;