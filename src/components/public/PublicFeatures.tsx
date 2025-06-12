
import { motion } from "framer-motion";
import { Search, Bell, Phone, Shield } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Signalement facile",
    description: "Photographiez et signalez une carte trouvée en quelques secondes avec notre interface intuitive."
  },
  {
    icon: Bell,
    title: "Notifications automatiques",
    description: "Le propriétaire est notifié immédiatement par WhatsApp et email dès qu'une carte est signalée."
  },
  {
    icon: Phone,
    title: "Contact direct",
    description: "Mise en relation directe entre le trouveur et le propriétaire pour organiser la récupération."
  },
  {
    icon: Shield,
    title: "Sécurité garantie",
    description: "Vos données sont protégées et seules les informations nécessaires sont partagées."
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
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            FinderID simplifie la récupération de documents perdus grâce à une technologie moderne 
            et une approche communautaire.
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
              className="text-center"
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
