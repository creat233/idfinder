import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Download, CheckCircle, Camera, Clock, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";

const Demo = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'search' | 'report'>('search');

  const searchSteps = [
    {
      title: "1. Recherchez votre document",
      description: "Utilisez notre moteur de recherche avancé",
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Search className="w-6 h-6" />
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

  const handleDownloadAPK = () => {
    const link = document.createElement('a');
    link.href = '/FinderID (1).apk';
    link.download = 'FinderID.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement démarré",
      description: "L'application FinderID est en cours de téléchargement",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Démo Interactive
              </h1>
              <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
                Découvrez comment Sama Pièce vous aide à retrouver vos documents perdus 
                ou à signaler des pièces trouvées en quelques clics seulement.
              </p>
              
              {/* Download Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-8"
              >
                <Button 
                  onClick={handleDownloadAPK}
                  size="lg"
                  className="bg-white text-[#9b87f5] hover:bg-gray-100 font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Download className="mr-3 h-6 w-6" />
                  📱 Télécharger pour Android
                </Button>
                <p className="text-sm text-purple-200 mt-2">
                  Ne manquez jamais une notification importante
                </p>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold">2000 Fr</div>
                  <div className="text-purple-200">Récompense trouveur</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">7000 Fr</div>
                  <div className="text-purple-200">Frais récupération</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24h</div>
                  <div className="text-purple-200">Temps moyen</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">🚚</div>
                  <div className="text-purple-200">Livraison disponible</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Info Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comment ça fonctionne financièrement ?
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    💰
                  </div>
                  <CardTitle className="text-2xl text-green-700">Pour le trouveur</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-4">2000 Fr</div>
                  <p className="text-gray-700">
                    Récompense versée automatiquement une fois le document restitué au propriétaire
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    📄
                  </div>
                  <CardTitle className="text-2xl text-blue-700">Pour le propriétaire</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-4">7000 Fr</div>
                  <p className="text-gray-700 mb-4">
                    Frais de récupération incluant la récompense du trouveur et les frais de service
                  </p>
                  <p className="text-sm text-gray-600">
                    + Frais de livraison si vous choisissez cette option
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 max-w-2xl mx-auto">
                <strong>Option livraison :</strong> Nous proposons un service de livraison à domicile 
                pour vous faire parvenir votre document récupéré. Les frais de livraison sont à la charge du propriétaire.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
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
                  <Search className="w-5 h-5 mr-2" />
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

        {/* Success Stories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Témoignages de Réussite
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Découvrez comment Sama Pièce a aidé nos utilisateurs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Fatou Diop",
                  story: "J'ai retrouvé ma carte d'identité perdue en moins de 12h grâce à Sama Pièce !",
                  type: "Carte d'identité",
                  time: "12 heures",
                  cost: "7000 Fr"
                },
                {
                  name: "Mamadou Fall",
                  story: "Quelqu'un avait trouvé mon permis de conduire. Le contact s'est fait rapidement.",
                  type: "Permis de conduire",
                  time: "6 heures",
                  cost: "7000 Fr"
                },
                {
                  name: "Aissatou Ba",
                  story: "J'ai pu aider une personne à récupérer sa carte étudiante et j'ai reçu ma récompense !",
                  type: "Carte étudiante",
                  time: "24 heures",
                  reward: "2000 Fr"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] rounded-full flex items-center justify-center text-white font-bold">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">{testimonial.type}</Badge>
                            <Badge variant="outline">{testimonial.time}</Badge>
                            {testimonial.cost && <Badge className="bg-blue-100 text-blue-700">{testimonial.cost}</Badge>}
                            {testimonial.reward && <Badge className="bg-green-100 text-green-700">{testimonial.reward}</Badge>}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 italic">"{testimonial.story}"</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Prêt à commencer ?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Rejoignez notre communauté solidaire et ne perdez plus jamais vos documents !
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-[#9b87f5] hover:bg-gray-100 font-semibold px-8 py-4 rounded-full shadow-lg"
                  onClick={() => window.location.href = '/signaler'}
                >
                  Commencer maintenant
                </Button>
                <Button 
                  onClick={handleDownloadAPK}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 rounded-full"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Télécharger l'app
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Demo;
