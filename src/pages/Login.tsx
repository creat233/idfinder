
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const mounted = useRef(true);
  const { toast } = useToast();

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
          title: "Erreur",
          description: "L'utilisateur existe déjà. Veuillez vous connecter.",
          variant: "destructive",
        });
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="flex flex-col items-center">
          <motion.img
            src="/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png"
            alt="Logo"
            className="w-20 h-20 mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-center text-4xl font-extrabold text-gray-900 mb-2"
          >
            Sama Pièce
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-3 max-w-sm mb-6"
          >
            <p className="text-lg text-gray-600">
              Connectez-vous pour accéder à votre compte
            </p>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-700 leading-relaxed">
                Bienvenue sur Sama Pièce, votre plateforme dédiée à la gestion simplifiée de vos pièces d'identité perdues. 
                Signalez, retrouvez et restituez facilement les documents égarés grâce à notre communauté solidaire.
              </p>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/80 backdrop-blur-lg py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100"
        >
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                    inputBackground: 'white',
                    inputBorder: '#E2E8F0',
                    inputBorderHover: '#9b87f5',
                    inputBorderFocus: '#7E69AB',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'w-full px-4 py-3 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white font-medium rounded-lg hover:opacity-90 transition-opacity duration-200',
                input: 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-[#9b87f5] transition-all duration-200',
                label: 'block text-sm font-medium text-gray-700 mb-1',
                anchor: 'text-[#7E69AB] hover:text-[#6E59A5] transition-colors duration-200',
              },
            }}
            theme="default"
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Mot de passe",
                  button_label: "Se connecter",
                  loading_button_label: "Connexion en cours...",
                  password_input_placeholder: "Votre mot de passe",
                  email_input_placeholder: "Votre adresse email",
                  link_text: "Créer un nouveau compte"
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Mot de passe",
                  button_label: "S'inscrire",
                  loading_button_label: "Inscription en cours...",
                  password_input_placeholder: "Choisissez un mot de passe",
                  email_input_placeholder: "Votre adresse email",
                  link_text: "Se connecter"
                },
                forgotten_password: {
                  email_label: "Email",
                  button_label: "Réinitialiser le mot de passe",
                  loading_button_label: "Envoi en cours...",
                  link_text: "Mot de passe oublié ?"
                },
              },
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
