
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { PublicHeader } from "@/components/PublicHeader";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

type AuthMode = 'login' | 'register' | 'reset';

const LoginView = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const { loading, error, onLogin, onRegister, onResetPassword, setError } = useAuth();
  const { t } = useTranslation();

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
  };

  console.log('🔍 LoginView - Mode actuel:', mode);

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center space-y-2 pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {mode === 'login' && t('login')}
                {mode === 'register' && t('createAccount')}
                {mode === 'reset' && t('resetPassword')}
              </CardTitle>
              <p className="text-gray-600">
                {mode === 'login' && t('accessAccount')}
                {mode === 'register' && t('joinFinderID')}
                {mode === 'reset' && 'Réinitialisez votre mot de passe'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {mode === 'login' && (
                <LoginForm
                  onSubmit={onLogin}
                  loading={loading}
                  onSwitchToRegister={() => handleModeChange('register')}
                  onSwitchToReset={() => handleModeChange('reset')}
                />
              )}

              {mode === 'register' && (
                <RegisterForm
                  onSubmit={onRegister}
                  loading={loading}
                  onSwitchToLogin={() => handleModeChange('login')}
                />
              )}

              {mode === 'reset' && (
                <ResetPasswordForm
                  onSubmit={onResetPassword}
                  loading={loading}
                  onSwitchToLogin={() => handleModeChange('login')}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
