
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Users, Target, Heart } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const About = () => {
  const { t } = useTranslation();

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
                {t("about_title")}
              </h1>
              <p className="text-xl text-purple-100 leading-relaxed">
                {t("about_subtitle")}
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
                  {t("about_mission_title")}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {t("about_mission_desc")}
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
                  <h3 className="text-xl font-semibold mb-2">{t("about_value_security_title")}</h3>
                  <p className="text-gray-600">
                    {t("about_value_security_desc")}
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
                  <h3 className="text-xl font-semibold mb-2">{t("about_value_community_title")}</h3>
                  <p className="text-gray-600">
                    {t("about_value_community_desc")}
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
                  <h3 className="text-xl font-semibold mb-2">{t("about_value_efficiency_title")}</h3>
                  <p className="text-gray-600">
                    {t("about_value_efficiency_desc")}
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
                  <h3 className="text-xl font-semibold mb-2">{t("about_value_solidarity_title")}</h3>
                  <p className="text-gray-600">
                    {t("about_value_solidarity_desc")}
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
                  {t("about_story_title")}
                </h2>
                <div className="text-lg text-gray-600 space-y-6 text-left">
                  <p>
                    {t("about_story_p1")}
                  </p>
                  <p>
                    {t("about_story_p2")}
                  </p>
                  <p>
                    {t("about_story_p3")}
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
                  {t("about_contact_title")}
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  {t("about_contact_desc")}
                </p>
                <div className="bg-gray-50 rounded-lg p-8">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {t("about_contact_email_label")}
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
