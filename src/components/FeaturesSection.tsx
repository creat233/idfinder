
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Award, Lock } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Service sécurisé",
      description: "Vos informations personnelles sont protégées grâce à notre système de sécurité avancé."
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Récupération rapide",
      description: "Un délai moyen de 24h pour retrouver et récupérer vos documents d'identité."
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Récompenses garanties",
      description: "Une récompense de 2000 Fr pour chaque découvreur qui restitue une pièce d'identité."
    },
    {
      icon: <Lock className="h-10 w-10 text-primary" />,
      title: "Confidentialité",
      description: "Nous assurons une mise en relation discrète entre le propriétaire et le découvreur."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pourquoi nous choisir ?
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          FinderID vous offre le moyen le plus rapide et le plus sûr de retrouver vos documents perdus
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-primary">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
