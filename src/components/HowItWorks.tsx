import { CheckCircle, Search, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-secondary mx-auto mb-4" />,
      title: "1. Signalez une carte",
      description: "Remplissez le formulaire avec les détails de la carte d'identité trouvée"
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-secondary mx-auto mb-4" />,
      title: "2. Vérification",
      description: "Notre équipe vérifie les informations et contacte le propriétaire"
    },
    {
      icon: <CreditCard className="w-12 h-12 text-secondary mx-auto mb-4" />,
      title: "3. Recevez votre récompense",
      description: "Obtenez 1000 CHF une fois la carte restituée à son propriétaire"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Comment ça marche ?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              {step.icon}
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};