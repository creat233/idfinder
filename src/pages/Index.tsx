import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  if (!mounted.current) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-white flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Header />
        <main className="flex-grow">
          <Hero />
          <Stats />
          <HowItWorks />
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;