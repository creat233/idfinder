
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
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const { data: adminStatus, error } = await supabase.rpc('is_admin');

      if (error) {
        console.error('Error checking admin status:', error);
        navigate("/login");
        return;
      }

      setIsAdmin(adminStatus);

      if (adminStatus) {
        // Admin can access admin routes, profile, and notifications
        const currentPath = window.location.pathname;
        if (currentPath === "/") {
          navigate("/admin/codes-promo");
        }
      } else {
        // Non-admin should be redirected away from admin routes
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

  // Only allow access if user is authenticated and is admin
  return user && isAdmin ? <>{children}</> : null;
};
