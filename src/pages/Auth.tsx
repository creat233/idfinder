
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/hooks/useTranslation";

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    if (isSignUp) {
      if (!firstName.trim() || firstName.length < 2) {
        showError("Erreur", "Le prénom doit contenir au moins 2 caractères");
        return false;
      }
      if (!lastName.trim() || lastName.length < 2) {
        showError("Erreur", "Le nom doit contenir au moins 2 caractères");
        return false;
      }
      if (!phone.trim() || phone.length < 8) {
        showError("Erreur", "Le numéro de téléphone est obligatoire et doit contenir au moins 8 chiffres");
        return false;
      }
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
      if (!phoneRegex.test(phone)) {
        showError("Erreur", "Format de téléphone invalide (ex: +221 77 123 45 67)");
        return false;
      }
    }
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        console.log("🔄 Inscription avec validation stricte...");
        
        const { data: authData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              phone: phone.trim(),
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) throw error;

        // Sauvegarder explicitement dans la table profiles
        if (authData?.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              phone: phone.trim(),
              country: 'SN'
            });

          if (profileError) {
            console.error("Erreur de sauvegarde du profil:", profileError);
          }
        }
        
        showSuccess(
          "Inscription réussie",
          "Compte créé avec toutes vos informations. Vérifiez votre email pour confirmer."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        showSuccess(t("loginSuccess"));
        navigate("/");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      showError("Erreur", error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isSignUp ? t("createAccount") : t("login")}
          </h2>
          <p className="mt-2 text-gray-600">
            {isSignUp ? t("joinFinderID") : t("accessAccount")}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleAuth}>
          {isSignUp && (
            <>
              <div>
                <Label htmlFor="firstName">{t("firstName")} *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Minimum 2 caractères"
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName">{t("lastName")} *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Minimum 2 caractères"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">{t("phone")} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="ex: +221 77 123 45 67"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Obligatoire pour recevoir les notifications WhatsApp
                </p>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">{t("email")} *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">{t("password")} *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignUp && (
            <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
              <strong>Important :</strong> Tous les champs marqués d'un (*) sont obligatoires. 
              Votre numéro de téléphone sera utilisé pour vous contacter via WhatsApp.
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("loading") : isSignUp ? t("register") : t("login")}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp 
              ? t("alreadyHaveAccount")
              : t("noAccount")
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
