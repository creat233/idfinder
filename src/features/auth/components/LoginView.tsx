
import { motion } from "framer-motion";
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordForm from "./ResetPasswordForm";
import LoginHeader from "./LoginHeader";
import AuthCard from "./AuthCard";
import { useAuth } from "../hooks/useAuth";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ViewState = "sign_in" | "sign_up" | "reset_password";

const LoginView = () => {
  const [view, setView] = useState<ViewState>("sign_in");
  const { loading, error, onLogin, onRegister, onResetPassword } = useAuth();
  const { toast } = useToast();

  const handleDownloadAPK = () => {
    const link = document.createElement('a');
    link.href = '/FinderID (1).apk';
    link.download = 'FinderID.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement démarré",
      description: "L'application FinderID est en cours de téléchargement",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#9b87f5] via-[#7E69AB] to-purple-600 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-yellow-300 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <LoginHeader />
        
        {/* Download App Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
            <h3 className="text-white text-lg font-semibold mb-3">
              📱 Téléchargez notre app mobile
            </h3>
            <p className="text-purple-100 text-sm mb-4">
              Recevez des notifications instantanées et ne manquez jamais une alerte importante
            </p>
            <Button 
              onClick={handleDownloadAPK}
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold transition-all duration-300 hover:scale-105"
            >
              <Download className="mr-2 h-4 w-4" />
              Télécharger Android
            </Button>
          </div>
        </motion.div>
        
        {view === "sign_in" ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AuthCard title="Connexion" error={error}>
              <LoginForm onSubmit={onLogin} loading={loading} />
              <div className="text-center mt-4 space-y-3">
                <p className="text-sm text-gray-600">
                  <button 
                    type="button"
                    onClick={() => setView("reset_password")}
                    className="text-[#7E69AB] hover:text-[#6E59A5] transition-colors duration-200 font-medium"
                  >
                    Mot de passe oublié ?
                  </button>
                </p>
                <button 
                  type="button"
                  onClick={() => setView("sign_up")}
                  className="text-[#7E69AB] hover:text-[#6E59A5] transition-colors duration-200 text-sm font-medium block w-full py-2 px-4 rounded-lg border border-[#7E69AB]/20 hover:bg-[#7E69AB]/5"
                >
                  Créer un nouveau compte
                </button>
              </div>
            </AuthCard>
          </motion.div>
        ) : view === "sign_up" ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AuthCard title="Créer un nouveau compte" error={error}>
              <RegisterForm onSubmit={onRegister} loading={loading} />
              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => setView("sign_in")}
                  className="text-[#7E69AB] hover:text-[#6E59A5] transition-colors duration-200 text-sm font-medium block w-full py-2 px-4 rounded-lg border border-[#7E69AB]/20 hover:bg-[#7E69AB]/5"
                >
                  Déjà un compte ? Se connecter
                </button>
              </div>
            </AuthCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AuthCard title="Réinitialiser le mot de passe" error={error}>
              <ResetPasswordForm 
                onSubmit={onResetPassword} 
                loading={loading} 
                onCancel={() => setView("sign_in")} 
              />
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                  📧 Un email sera envoyé avec les instructions pour réinitialiser votre mot de passe
                </p>
              </div>
            </AuthCard>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mt-8"
        >
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white">+1000</div>
            <div className="text-purple-200 text-xs">Documents retrouvés</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white">24h</div>
            <div className="text-purple-200 text-xs">Temps moyen</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white">🇸🇳</div>
            <div className="text-purple-200 text-xs">Fait au Sénégal</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginView;
