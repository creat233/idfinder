
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PublicPricing = () => {
  const navigate = useNavigate();

  return (
    <section id="tarifs" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tarifs transparents
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des prix justes pour un service efficace. Payez seulement quand vous récupérez votre document.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Trouveur */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 hover:border-[#9b87f5] transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Trouveur</CardTitle>
                <div className="text-4xl font-bold text-[#9b87f5]">2 000 Fr</div>
                <p className="text-gray-600">Récompense pour avoir signalé</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Signalement gratuit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Récompense garantie</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Paiement Mobile Money</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Propriétaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 border-[#9b87f5] shadow-lg">
              <CardHeader className="text-center bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white rounded-t-lg">
                <CardTitle className="text-2xl">Propriétaire</CardTitle>
                <div className="text-4xl font-bold">7 000 Fr</div>
                <p className="text-purple-100">Frais de récupération</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Notification immédiate</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Contact direct avec trouveur</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Support 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Livraison possible</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gratuit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 hover:border-green-500 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Cartes spéciales</CardTitle>
                <div className="text-4xl font-bold text-green-500">Gratuit</div>
                <p className="text-gray-600">Cartes étudiantes & santé</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Cartes étudiantes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Cartes de santé</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Contact direct gratuit</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            size="lg"
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white hover:opacity-90 px-8 py-4 text-lg"
          >
            Commencer maintenant
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
