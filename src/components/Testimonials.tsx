
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface Testimonial {
  content: string;
  author: string;
  role: string;
}

export const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      content: "Grâce à FinderID, j'ai pu récupérer ma carte d'identité en moins de 48h après l'avoir perdue. Le service est rapide et efficace !",
      author: "Mamadou D.",
      role: "Dakar"
    },
    {
      content: "J'étais très inquiet après avoir perdu mon passeport. FinderID m'a mis en contact avec la personne qui l'avait trouvé en seulement 24 heures.",
      author: "Fatou N.",
      role: "Saint-Louis"
    },
    {
      content: "Un service essentiel pour notre communauté ! La récompense offerte encourage réellement les gens à rendre les documents perdus.",
      author: "Abdoulaye S.",
      role: "Thiès"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="testimonials" className="py-16 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ce que disent nos utilisateurs
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />
                  <p className="italic text-gray-600 mb-6">{testimonial.content}</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-500">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
