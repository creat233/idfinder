
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      
      if (!user) {
        navigate("/login");
        return;
      }

      // Rediriger vers l'interface admin si c'est le bon email
      if (user.email === "mouhamed110000@gmail.com") {
        if (window.location.pathname === "/") {
          navigate("/admin/codes-promo");
        }
      } else {
        // Rediriger les autres utilisateurs vers le dashboard normal
        if (window.location.pathname.startsWith("/admin")) {
          navigate("/");
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (!currentUser) {
          navigate("/login");
          return;
        }

        // Redirection automatique basée sur l'email
        if (currentUser.email === "mouhamed110000@gmail.com") {
          if (window.location.pathname === "/") {
            navigate("/admin/codes-promo");
          }
        } else {
          if (window.location.pathname.startsWith("/admin")) {
            navigate("/");
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};
