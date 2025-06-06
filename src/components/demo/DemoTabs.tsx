
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, CheckCircle, Camera, Clock, Users } from "lucide-react";

export const DemoTabs = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'report'>('search');

  const searchSteps = [
    {
      title: "1. Recherchez votre document",
      description: "Utilisez notre moteur de recherche avancé",
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <MapPin className="w-6 h-6" />
    },
    {
      title: "2. Localisez votre pièce",
      description: "Visualisez l'emplacement exact où elle a été trouvée",
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <MapPin className="w-6 h-6" />
    },
    {
      title: "3. Contactez le trouveur",
      description: "Communiquez directement via notre plateforme sécurisée",
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Phone className="w-6 h-6" />
    },
    {
      title: "4. Récupérez votre document",
      description: "Organisez la récupération ou demandez une livraison (frais à votre charge)",
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  const reportSteps = [
    {
      title: "1. Prenez une photo",
      description: "Photographiez le document trouvé (masquez les infos sensibles)",
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Camera className="w-6 h-6" />
    },
    {
      title: "2. Indiquez le lieu",
      description: "Précisez où vous avez trouvé le document",
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <MapPin className="w-6 h-6" />
    },
    {
      title: "3. Publiez l'annonce",
      description: "Votre signalement est immédiatement visible",
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Clock className="w-6 h-6" />
    },
    {
      title: "4. Recevez votre récompense",
      description: "Gagnez 2000 Fr une fois le document restitué au propriétaire",
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Users className="w-6 h-6" />
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Processus étape par étape
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez votre scénario et découvrez le processus
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-full p-1">
            <Button
              onClick={() => setActiveTab('search')}
              variant={activeTab === 'search' ? 'default' : 'ghost'}
              className={`rounded-full px-8 py-3 font-semibold transition-all ${
                activeTab === 'search' 
                  ? 'bg-[#9b87f5] text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-5 h-5 mr-2" />
              J'ai perdu ma pièce
            </Button>
            <Button
              onClick={() => setActiveTab('report')}
              variant={activeTab === 'report' ? 'default' : 'ghost'}
              className={`rounded-full px-8 py-3 font-semibold transition-all ${
                activeTab === 'report' 
                  ? 'bg-[#9b87f5] text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Camera className="w-5 h-5 mr-2" />
              J'ai trouvé une pièce
            </Button>
          </div>
        </div>

        {/* Steps Display */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {(activeTab === 'search' ? searchSteps : reportSteps).map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full border-2 border-gray-100 hover:border-[#9b87f5] transition-all duration-300 hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {step.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-32 object-contain rounded-lg mb-4 border border-gray-200"
                  />
                  <CardDescription className="text-gray-600">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
