
import { motion } from "framer-motion";
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordForm from "./ResetPasswordForm";
import LoginHeader from "./LoginHeader";
import AuthCard from "./AuthCard";
import { useAuth } from "../hooks/useAuth";

type ViewState = "sign_in" | "sign_up" | "reset_password";

const LoginView = () => {
  const [view, setView] = useState<ViewState>("sign_in");
  const { loading, error, onLogin, onRegister, onResetPassword } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <LoginHeader />
        
        {view === "sign_in" ? (
          <AuthCard title="Connexion" error={error}>
            <LoginForm onSubmit={onLogin} loading={loading} />
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 mb-2">
                <button 
                  type="button"
                  onClick={() => setView("reset_password")}
                  className="text-[#7E69AB] hover:text-[#6E59A5]"
                >
                  Mot de passe oublié ?
                </button>
              </p>
              <button 
                type="button"
                onClick={() => setView("sign_up")}
                className="text-[#7E69AB] hover:text-[#6E59A5] transition-colors duration-200 text-sm font-medium"
              >
                Créer un compte
              </button>
            </div>
          </AuthCard>
        ) : view === "sign_up" ? (
          <AuthCard title="Créer un nouveau compte" error={error}>
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
          </AuthCard>
        ) : (
          <AuthCard title="Réinitialiser le mot de passe" error={error}>
            <ResetPasswordForm 
              onSubmit={onResetPassword} 
              loading={loading} 
              onCancel={() => setView("sign_in")} 
            />
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Un email sera envoyé avec les instructions pour réinitialiser votre mot de passe
              </p>
            </div>
          </AuthCard>
        )}
      </motion.div>
    </div>
  );
};

export default LoginView;
