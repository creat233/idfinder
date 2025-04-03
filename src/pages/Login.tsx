
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const Login = () => {
  const navigate = useNavigate();
  const mounted = useRef(true);
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Schema for registration form
  const registerSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    phone: z.string().min(1, "Le numéro de téléphone est requis"),
  });

  // Schema for login form
  const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
  });

  // Initialize registration form with validation
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  // Initialize login form with validation
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onRegister = async (values: z.infer<typeof registerSchema>) => {
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

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
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
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Votre adresse email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Votre mot de passe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white font-medium rounded-lg hover:opacity-90"
                    disabled={loading}
                  >
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                  </Button>
                  
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
                </form>
              </Form>
            </>
          ) : (
            <>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <h3 className="text-lg font-medium mb-4">Créer un nouveau compte</h3>
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre numéro de téléphone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Votre adresse email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Choisissez un mot de passe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white font-medium rounded-lg hover:opacity-90"
                    disabled={loading}
                  >
                    {loading ? 'Inscription en cours...' : 'Créer un compte'}
                  </Button>
                  
                  <div className="text-center">
                    <button 
                      type="button"
                      onClick={() => setView("sign_in")}
                      className="text-[#7E69AB] hover:text-[#6E59A5] transition-colors duration-200 text-sm font-medium"
                    >
                      Déjà un compte ? Se connecter
                    </button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
