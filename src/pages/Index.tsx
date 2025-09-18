
import { PublicHeader } from "@/components/PublicHeader";
import { PublicHero } from "@/components/public/PublicHero";
import { PublicFeatures } from "@/components/public/PublicFeatures";
import { PublicPricing } from "@/components/public/PublicPricing";
import { PublicCTA } from "@/components/public/PublicCTA";
import { HomeSEO } from "@/components/seo/HomeSEO";
import { SecurityProvider } from "@/components/SecurityProvider";

const Index = () => {
  return (
    <SecurityProvider>
      <HomeSEO />
      <div className="flex flex-col min-h-screen">
        <PublicHeader />
        <main className="flex-grow pt-16 pb-20 md:pb-0">
          <PublicHero />
          <PublicFeatures />
          <PublicPricing />
          <PublicCTA />
        </main>
      </div>
    </SecurityProvider>
  );
};

export default Index;
