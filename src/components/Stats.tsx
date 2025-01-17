import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export const Stats = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">2'000 CHF</h3>
              <p className="text-gray-600">Récompense pour les découvreurs</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">5'000 CHF</h3>
              <p className="text-gray-600">Frais de récupération</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="p-6 text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">24h</h3>
              <p className="text-gray-600">Délai moyen de récupération</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};