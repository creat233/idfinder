import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export const Stats = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="transform transition-all duration-300"
          >
            <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-4xl font-bold text-primary mb-2">2'000 Fr</h3>
              <p className="text-gray-600">Récompense pour les découvreurs</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="transform transition-all duration-300"
          >
            <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-4xl font-bold text-primary mb-2">5'000 Fr</h3>
              <p className="text-gray-600">Frais de récupération</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="transform transition-all duration-300"
          >
            <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-4xl font-bold text-primary mb-2">24h</h3>
              <p className="text-gray-600">Délai moyen de récupération</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};