import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      }
      if (event === 'USER_UPDATED') {
        const { error } = await supabase.auth.getSession();
        if (error) {
          setError(getErrorMessage(error));
        } else {
          setError(null);
        }
      }
      if (event === 'SIGNED_OUT') {
        setError(null);
      }
      if (event === 'SIGNED_UP') {
        setError("Veuillez vérifier votre email pour confirmer votre compte.");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    console.log("Auth error:", error);
    
    if (error.message.includes("over_email_send_rate_limit")) {
      return "Pour des raisons de sécurité, veuillez attendre quelques secondes avant de réessayer.";
    }
    
    switch (error.message) {
      case "Invalid login credentials":
        return "Email ou mot de passe incorrect. Veuillez vérifier vos informations.";
      case "Email not confirmed":
        return "Veuillez vérifier votre email avant de vous connecter.";
      case "User not found":
        return "Aucun utilisateur trouvé avec ces identifiants.";
      default:
        return "Une erreur s'est produite. Veuillez réessayer.";
    }
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