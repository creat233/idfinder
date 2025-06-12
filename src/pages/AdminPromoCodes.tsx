
import { Header } from "@/components/Header";
import { AdminPromoActivation } from "@/components/promo/AdminPromoActivation";
import { AdminPromoCodesList } from "@/components/promo/AdminPromoCodesList";
import { AdminRecoveriesList } from "@/components/promo/AdminRecoveriesList";
import { AdminPendingCodes } from "@/components/promo/AdminPendingCodes";

const AdminPromoCodes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-orange-800">Administration FinderID</h1>
            <p className="text-muted-foreground">Interface d'administration des codes promo et récupérations</p>
          </div>
          
          <AdminPendingCodes />
          <AdminPromoActivation />
          <AdminRecoveriesList />
          <AdminPromoCodesList />
        </div>
      </main>
    </div>
  );
};

export default AdminPromoCodes;
