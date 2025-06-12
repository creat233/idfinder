
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Users, Target, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                À propos de FinderID
              </h1>
              <p className="text-xl text-purple-100 leading-relaxed">
                FinderID est une plateforme innovante qui révolutionne la récupération 
                de documents perdus au Sénégal, en créant un pont entre ceux qui trouvent 
                et ceux qui cherchent leurs pièces d'identité.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Notre Mission
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Faciliter la récupération des documents perdus en créant une communauté 
                  solidaire où chaque citoyen peut contribuer à aider ses concitoyens 
                  à retrouver leurs pièces d'identité importantes.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-[#9b87f5]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sécurité</h3>
                  <p className="text-gray-600">
                    Protection des données personnelles et transactions sécurisées
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-[#9b87f5]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Communauté</h3>
                  <p className="text-gray-600">
                    Une plateforme collaborative basée sur l'entraide mutuelle
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-[#9b87f5]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Efficacité</h3>
                  <p className="text-gray-600">
                    Processus simplifié pour une récupération rapide des documents
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-[#9b87f5]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Solidarité</h3>
                  <p className="text-gray-600">
                    Encourager l'esprit d'entraide et de citoyenneté responsable
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Notre Histoire
                </h2>
                <div className="text-lg text-gray-600 space-y-6 text-left">
                  <p>
                    FinderID est né d'un constat simple : chaque jour au Sénégal, 
                    des centaines de personnes perdent leurs documents d'identité, 
                    créant des situations stressantes et coûteuses.
                  </p>
                  <p>
                    Parallèlement, de nombreuses personnes trouvent ces documents 
                    mais ne savent pas comment les restituer efficacement à leurs 
                    propriétaires légitimes.
                  </p>
                  <p>
                    C'est de cette problématique qu'est née l'idée de créer une 
                    plateforme digitale moderne qui connecte les "trouveurs" et 
                    les "chercheurs", tout en garantissant la sécurité et la 
                    vérification des identités.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Contactez-nous
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Vous avez des questions ou des suggestions ? N'hésitez pas à nous contacter.
                </p>
                <div className="bg-gray-50 rounded-lg p-8">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Email de support
                  </p>
                  <a 
                    href="mailto:idfinder06@gmail.com" 
                    className="text-[#9b87f5] hover:text-[#7E69AB] font-medium text-lg"
                  >
                    idfinder06@gmail.com
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
