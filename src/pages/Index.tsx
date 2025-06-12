
import { PublicHeader } from "@/components/PublicHeader";
import { PublicHero } from "@/components/public/PublicHero";
import { PublicFeatures } from "@/components/public/PublicFeatures";
import { PublicPricing } from "@/components/public/PublicPricing";
import { PublicCTA } from "@/components/public/PublicCTA";
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
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <PublicHeader />
        <main className="flex-grow">
          <PublicHero />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <PublicFeatures />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <PublicPricing />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <PublicCTA />
          </motion.div>
        </main>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Footer />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
