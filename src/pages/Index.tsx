
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicHero } from "@/components/public/PublicHero";
import { PublicFeatures } from "@/components/public/PublicFeatures";
import { PublicPricing } from "@/components/public/PublicPricing";
import { PublicCTA } from "@/components/public/PublicCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Si c'est l'admin, rediriger vers l'interface d'administration
        if (user.email === "mouhamed110000@gmail.com") {
          navigate("/admin/codes-promo");
        }
        // Pour les utilisateurs normaux, rester sur la page d'accueil
        // avec accès à la barre de recherche
      }
    };

    checkUserAndRedirect();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          if (session.user.email === "mouhamed110000@gmail.com") {
            navigate("/admin/codes-promo");
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main>
        <PublicHero />
        <PublicFeatures />
        <PublicPricing />
        <PublicCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
