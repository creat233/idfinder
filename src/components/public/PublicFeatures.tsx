
import { motion } from "framer-motion";
import { Search, Bell, Handshake, Award } from "lucide-react";
import { useTranslation } from "@/providers/TranslationProvider";

const featureIcons = {
  search: Search,
  bell: Bell,
  handshake: Handshake,
  award: Award,
};

export const PublicFeatures = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: featureIcons.search,
      title: t("features_signal_title"),
      description: t("features_signal_desc")
    },
    {
      icon: featureIcons.bell,
      title: t("features_alert_title"),
      description: t("features_alert_desc")
    },
    {
      icon: featureIcons.handshake,
      title: t("features_coordinate_title"),
      description: t("features_coordinate_desc")
    },
    {
      icon: featureIcons.award,
      title: t("features_reward_title"),
      description: t("features_reward_desc")
    }
  ];

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
            {t("features_main_title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("features_main_desc")}
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
