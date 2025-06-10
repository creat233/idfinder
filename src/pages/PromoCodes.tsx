
import { Header } from "@/components/Header";
import { PromoCodesManager } from "@/components/promo/PromoCodesManager";

const PromoCodes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PromoCodesManager />
      </main>
    </div>
  );
};

export default PromoCodes;
