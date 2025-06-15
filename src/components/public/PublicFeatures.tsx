
import { motion } from "framer-motion";
import { Search, Bell, Handshake, Award } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "1. Signalez la trouvaille",
    description: "Vous avez trouvé une carte ? Entrez son numéro sur notre plateforme en quelques secondes. C'est simple et rapide."
  },
  {
    icon: Bell,
    title: "2. Le propriétaire est alerté",
    description: "Nous notifions instantanément le propriétaire par WhatsApp et e-mail, lui donnant l'espoir de retrouver son bien."
  },
  {
    icon: Handshake,
    title: "3. Coordonnez la restitution",
    description: "Notre plateforme sécurisée vous met en contact pour convenir d'un rendez-vous pour la restitution."
  },
  {
    icon: Award,
    title: "4. Recevez votre récompense",
    description: "Une fois la carte rendue, recevez 2'000 Fr. pour votre bonne action. Votre honnêteté est précieuse."
  }
];

export const PublicFeatures = () => {
  return (
    <section id="fonctionnalites" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Un processus simple, rapide et gratifiant
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous avons conçu une expérience en quatre étapes pour que la restitution de documents perdus soit facile pour tout le monde. Voici comment ça marche.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-gray-50 rounded-2xl transition-transform transform hover:-translate-y-2"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] rounded-2xl flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
