
import { PublicHeader } from "@/components/PublicHeader";
import { PublicHero } from "@/components/public/PublicHero";
import { PublicFeatures } from "@/components/public/PublicFeatures";
import { PublicPricing } from "@/components/public/PublicPricing";
import { PublicCTA } from "@/components/public/PublicCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow pt-16">
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
