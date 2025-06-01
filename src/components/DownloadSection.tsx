
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const DownloadSection = () => {
  const handleDownloadAPK = () => {
    // This would link to your actual APK download
    window.open('#', '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Téléchargez l'application mobile
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Accédez à FinderID directement depuis votre smartphone Android
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-6">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Application Android</CardTitle>
                <CardDescription className="text-lg">
                  Version mobile optimisée pour Android
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Application sécurisée et fiable</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span>Interface rapide et intuitive</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <span>Optimisée pour mobile</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleDownloadAPK}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Télécharger APK Android
                </Button>
                
                <p className="text-sm text-gray-500 text-center">
                  Compatible avec Android 6.0 et versions ultérieures
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                Pourquoi télécharger l'application ?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Accès hors ligne</h4>
                    <p className="text-gray-600">Consultez vos informations même sans connexion internet</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Notifications push</h4>
                    <p className="text-gray-600">Recevez des alertes en temps réel sur vos documents</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Performance optimisée</h4>
                    <p className="text-gray-600">Application native plus rapide et plus fluide</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
