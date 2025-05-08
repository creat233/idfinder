
import { CheckCircle, Search, CreditCard, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HowItWorks = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: <Search className="w-16 h-16 text-secondary mx-auto mb-6" />,
      title: "1. Signalez une carte",
      description: "Remplissez le formulaire avec les détails de la carte d'identité que vous avez trouvée"
    },
    {
      icon: <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-6" />,
      title: "2. Vérification",
      description: "Notre équipe vérifie les informations et contacte le propriétaire du document dans les plus brefs délais"
    },
    {
      icon: <PhoneCall className="w-16 h-16 text-secondary mx-auto mb-6" />,
      title: "3. Contactez FinderID",
      description: "Appelez notre service client au 77 123 45 67 pour organiser la récupération de votre carte"
    },
    {
      icon: <CreditCard className="w-16 h-16 text-secondary mx-auto mb-6" />,
      title: "4. Recevez votre récompense",
      description: "Obtenez 2000 Fr une fois que la carte est restituée à son propriétaire légitime"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };
  
  const handleCallSupport = () => {
    window.location.href = "tel:77 123 45 67";
  };

  return (
    <section id="how-it-works" className="py-20 bg-white relative">
      {/* Cercle décoratif */}
      <div className="hidden md:block absolute top-10 left-10 w-64 h-64 rounded-full bg-primary/5 -z-10"></div>
      <div className="hidden md:block absolute bottom-10 right-10 w-48 h-48 rounded-full bg-secondary/5 -z-10"></div>
      
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Comment ça marche ?
        </motion.h2>
        
        <motion.p
          className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Un processus simple et efficace pour signaler et récupérer les pièces d'identité perdues
        </motion.p>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Ligne de connexion entre les étapes (visible uniquement sur desktop) */}
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="z-10"
            >
              <Card className="h-full text-center p-8 hover:shadow-xl transition-all duration-300 border-0">
                <CardContent className="p-0">
                  <div className="bg-white rounded-full p-4 inline-block mb-2">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          className="text-center max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex flex-col items-center">
            <img 
              src="/lovable-uploads/6c6264f8-36ef-4a98-b7b3-44231cd5d48e.png" 
              alt="Vérification" 
              className="w-24 h-24 mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">Service d'appel FinderID</h3>
            <p className="text-gray-600 mb-4">
              Après avoir retrouvé votre carte sur notre plateforme, contactez directement notre service clientèle pour organiser sa récupération
            </p>
            <Button 
              size="lg" 
              onClick={handleCallSupport}
              className="flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              Appeler maintenant: 77 123 45 67
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
