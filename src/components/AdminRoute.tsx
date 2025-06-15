
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
    const checkAccess = async () => {
      const { data: isAdmin, error } = await supabase.rpc('is_admin');

      if (error) {
        console.error('Error checking admin status:', error);
        if (window.location.pathname.startsWith("/admin")) {
          navigate("/");
        }
        return;
      }

      if (isAdmin) {
        if (window.location.pathname === "/") {
          navigate("/admin/codes-promo");
        }
      } else {
        if (window.location.pathname.startsWith("/admin")) {
          navigate("/");
        }
      }
    };

    const checkUserAndSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        navigate("/login");
        setLoading(false);
        return;
      }
      await checkAccess();
      setLoading(false);
    };

    checkUserAndSubscription();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (!currentUser) {
          navigate("/login");
          return;
        }

        if (event === 'SIGNED_IN') {
            await checkAccess();
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
