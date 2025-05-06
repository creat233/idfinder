
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Clock, Award } from "lucide-react";

export const Stats = () => {
  const stats = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      value: "2'000 Fr",
      label: "Récompense pour les découvreurs",
      description: "Pour chaque carte restituée"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      value: "7'000 Fr",
      label: "Frais de récupération",
      description: "Pour le propriétaire du document"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      value: "24h",
      label: "Délai moyen de récupération",
      description: "Service rapide et efficace"
    }
  ];

  return (
    <section className="py-16 relative bg-gradient-to-b from-gray-50 to-white">
      {/* Élément décoratif */}
      <div className="absolute left-0 top-0 h-full w-1/6 bg-gradient-to-r from-primary/5 to-transparent"></div>
      <div className="absolute right-0 top-0 h-full w-1/6 bg-gradient-to-l from-secondary/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          FinderID en chiffres
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
              whileHover={{ scale: 1.03 }}
              className="transform transition-all duration-300"
            >
              <Card className="p-8 text-center shadow-lg hover:shadow-xl transition-shadow h-full border-b-4 border-b-primary">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-primary mb-2">{stat.value}</h3>
                <p className="text-lg font-medium text-gray-700 mb-2">{stat.label}</p>
                <p className="text-gray-500 text-sm">{stat.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
