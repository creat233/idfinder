
import { Header } from "@/components/Header";
import { PromoCodesManager } from "@/components/promo/PromoCodesManager";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PromoCodes = () => {
  // Vérifier si l'utilisateur est admin pour afficher le panneau admin
  const { data: isAdmin } = useQuery({
    queryKey: ['is-admin'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('is_admin');
        if (error) throw error;
        return data;
      } catch {
        return false;
      }
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {isAdmin && (
          <div className="mb-8">
            <AdminNavigation />
          </div>
        )}
        <PromoCodesManager />
      </main>
    </div>
  );
};

export default PromoCodes;
