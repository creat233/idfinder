
import { motion } from "framer-motion";

export const EmergencyTips = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200"
    >
      <h2 className="text-xl font-semibold mb-4">Conseils en cas d'urgence</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Restez calme et parlez clairement lors de votre appel d'urgence</li>
        <li>Précisez votre localisation exacte</li>
        <li>Décrivez brièvement la situation d'urgence</li>
        <li>Suivez les instructions données par les opérateurs</li>
        <li>Ne raccrochez pas avant que l'opérateur ne vous y invite</li>
      </ul>
    </motion.div>
  );
};
