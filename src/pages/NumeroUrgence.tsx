
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PhoneCall, ArrowLeft, PhoneForwarded, Search, MapPin, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type EmergencyNumberType = {
  service: string;
  number: string;
  description: string;
  category: "police" | "medical" | "fire" | "other";
}

const NumeroUrgence = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  const emergencyNumbers: EmergencyNumberType[] = [
    { 
      service: "Police Nationale", 
      number: "17", 
      description: "Pour signaler un crime, un délit ou une situation dangereuse",
      category: "police"
    },
    { 
      service: "Sapeurs-Pompiers", 
      number: "18", 
      description: "Pour les urgences médicales, les incendies et les secours",
      category: "fire" 
    },
    { 
      service: "SAMU (Service d'Aide Médicale Urgente)", 
      number: "1515", 
      description: "Pour les urgences médicales graves nécessitant une intervention médicale",
      category: "medical" 
    },
    { 
      service: "Gendarmerie", 
      number: "800 00 20 20", 
      description: "Numéro vert de la Gendarmerie Nationale",
      category: "police" 
    },
    { 
      service: "Centre Anti-Poison", 
      number: "818 00 15 15", 
      description: "Pour les cas d'empoisonnement ou d'intoxication",
      category: "medical" 
    },
    { 
      service: "SOS Médecin", 
      number: "33 889 15 15", 
      description: "Service de médecins à domicile disponible 24h/24",
      category: "medical" 
    },
    { 
      service: "Croix-Rouge Sénégalaise", 
      number: "33 823 39 92", 
      description: "Assistance humanitaire et premiers secours",
      category: "other" 
    },
    { 
      service: "Protection Civile", 
      number: "33 889 31 00", 
      description: "Pour les catastrophes naturelles et situations d'urgence collective",
      category: "other" 
    }
  ];

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const filteredNumbers = emergencyNumbers.filter(item => {
    const matchesSearch = item.service.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "police", label: "Police", color: "bg-blue-500" },
    { id: "medical", label: "Médical", color: "bg-red-500" },
    { id: "fire", label: "Incendie", color: "bg-orange-500" },
    { id: "other", label: "Autres", color: "bg-purple-500" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white">
        <div className="container mx-auto py-12 px-4">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </div>

          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Numéros d'Urgence au Sénégal</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En cas d'urgence, contactez immédiatement les services appropriés. Ces numéros sont disponibles 24h/24 et 7j/7.
            </p>
          </motion.div>

          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                {categories.map(category => (
                  <Badge 
                    key={category.id}
                    className={`cursor-pointer ${activeCategory === category.id ? category.color + ' text-white' : 'bg-gray-100'}`}
                    onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  >
                    {category.label}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowMap(!showMap)}
              >
                <MapPin className="h-4 w-4" />
                {showMap ? "Masquer la carte" : "Afficher la carte"}
              </Button>
            </div>
          </div>

          {showMap && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 rounded-lg overflow-hidden border border-gray-200"
            >
              <div className="bg-gray-100 p-4 h-80 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gray-200 opacity-50"></div>
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `url('https://www.openstreetmap.org/export/embed.html?bbox=-17.5479,14.6042,-17.4261,14.7677&layer=mapnik')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'grayscale(0.5)'
                }}></div>
                <div className="relative z-10 bg-white p-4 rounded-lg shadow-lg">
                  <p className="font-medium text-center">Carte de localisation des services d'urgence</p>
                  <p className="text-sm text-gray-600 text-center mt-2">Cette fonctionnalité sera bientôt disponible</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredNumbers.length > 0 ? (
              filteredNumbers.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className={`overflow-hidden border-l-4 hover:shadow-lg transition-shadow ${
                    item.category === 'police' ? 'border-l-blue-500' :
                    item.category === 'medical' ? 'border-l-red-500' :
                    item.category === 'fire' ? 'border-l-orange-500' :
                    'border-l-purple-500'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-xl mb-2">{item.service}</h3>
                          <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                        </div>
                        <PhoneCall className={`h-6 w-6 flex-shrink-0 ${
                          item.category === 'police' ? 'text-blue-500' :
                          item.category === 'medical' ? 'text-red-500' :
                          item.category === 'fire' ? 'text-orange-500' :
                          'text-purple-500'
                        }`} />
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-2xl font-bold text-primary">{item.number}</span>
                        <Button 
                          onClick={() => handleCall(item.number)}
                          className="flex items-center gap-2"
                          variant={
                            item.category === 'police' ? 'default' :
                            item.category === 'medical' ? 'destructive' :
                            item.category === 'fire' ? 'secondary' :
                            'outline'
                          }
                        >
                          <PhoneForwarded size={16} />
                          Appeler
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Aucun résultat trouvé. Veuillez modifier votre recherche.</p>
              </div>
            )}
          </motion.div>
          
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NumeroUrgence;
