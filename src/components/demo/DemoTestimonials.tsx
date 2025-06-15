
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/providers/TranslationProvider";

export const DemoTestimonials = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: "Fatou Diop",
      story: t("testimonial1Story"),
      type: t("idCard"),
      time: t("testimonial1Time"),
      cost: "7000 Fr"
    },
    {
      name: "Mamadou Fall",
      story: t("testimonial2Story"),
      type: t("driverLicense"),
      time: t("testimonial2Time"),
      cost: "7000 Fr"
    },
    {
      name: "Aissatou Ba",
      story: t("testimonial3Story"),
      type: t("studentCard"),
      time: t("testimonial3Time"),
      reward: "2000 Fr"
    }
  ];

  return (
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
            {t("successStories")}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("discoverHow")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
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
  );
};
