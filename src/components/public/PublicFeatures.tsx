
import { motion } from "framer-motion";
import { Search, Bell, Handshake, Award } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const featureIcons = { search: Search, bell: Bell, handshake: Handshake, award: Award };

export const PublicFeatures = () => {
  const { t } = useTranslation();

  const features = [
    { icon: featureIcons.search, title: t("features_signal_title"), description: t("features_signal_desc") },
    { icon: featureIcons.bell, title: t("features_alert_title"), description: t("features_alert_desc") },
    { icon: featureIcons.handshake, title: t("features_coordinate_title"), description: t("features_coordinate_desc") },
    { icon: featureIcons.award, title: t("features_reward_title"), description: t("features_reward_desc") },
  ];

  return (
    <section id="fonctionnalites" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            {t("features_main_title")}
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            {t("features_main_desc")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}
              className="vapor-card text-center p-7"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, hsl(var(--vapor-lavender)), hsl(var(--vapor-indigo)))' }}>
                <feature.icon className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
