
import { Header } from "@/components/Header";
import { MCardDemo } from "@/components/mcards/MCardDemo";
import { DemoHero } from "@/components/demo/DemoHero";
import { DemoPricing } from "@/components/demo/DemoPricing";
import { DemoTabs } from "@/components/demo/DemoTabs";
import { DemoTestimonials } from "@/components/demo/DemoTestimonials";
import { DemoCTA } from "@/components/demo/DemoCTA";

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Header />
      
      <main className="pt-20">
        <DemoHero />
        <MCardDemo />
        <DemoPricing />
        <DemoTabs />
        <DemoTestimonials />
        <DemoCTA />
      </main>

    </div>
  );
};

export default Demo;
