
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const LoginView = () => {
  const navigate = useNavigate();
  const mounted = useRef(true);
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        return;
      }

      toast.default({
        title: "Compte créé avec succès",
        description: "Vous pouvez maintenant vous connecter",
      });
      
      setView("sign_in");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Une erreur s'est produite lors de l'inscription");
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
        return;
      }

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Une erreur s'est produite lors de la connexion");
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
        toast.default({
          title: "Compte créé avec succès",
          description: "Vous pouvez maintenant vous connecter",
        });
      } else if (event === 'SIGNED_IN') {
        if (mounted.current) {
          navigate("/");
        }
      } else if (event === 'USER_UPDATED') {
        toast.destructive({
          title: "Erreur",
          description: "L'utilisateur existe déjà. Veuillez vous connecter.",
        });
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

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
              {view === "sign_in" 
                ? "Connectez-vous pour accéder à votre compte" 
                : "Créez un compte pour commencer"
              }
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
          {view === "sign_in" ? (
            <>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <h3 className="text-lg font-medium mb-4">Connexion</h3>
              <LoginForm onSubmit={onLogin} loading={loading} />
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  <a href="#" className="text-[#7E69AB] hover:text-[#6E59A5]">
                    Mot de passe oublié ?
                  </a>
                </p>
                <button 
                  type="button"
                  onClick={() => setView("sign_up")}
                  className="text-[#7E69AB] hover:text-[#6E59A5] transition-colors duration-200 text-sm font-medium"
                >
                  Créer un compte avec des informations supplémentaires
                </button>
              </div>
            </>
          ) : (
            <>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <h3 className="text-lg font-medium mb-4">Créer un nouveau compte</h3>
              <RegisterForm onSubmit={onRegister} loading={loading} />
              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => setView("sign_in")}
                  className="text-[#7E69AB] hover:text-[#6E59A5] transition-colors duration-200 text-sm font-medium"
                >
                  Déjà un compte ? Se connecter
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginView;
