
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Shield, Zap, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export const DownloadSection = () => {
  const { toast } = useToast();

  const handleDownloadAPK = () => {
    try {
      // Utiliser votre lien localhost pour télécharger l'APK
      const link = document.createElement('a');
      link.href = 'http://localhost:8081/FinderID.apk';
      link.download = 'FinderID.apk';
      link.target = '_blank';
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Téléchargement commencé",
        description: "Le fichier APK est en cours de téléchargement",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le fichier APK",
      });
    }
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
            Téléchargez l'application mobile FinderID
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
            <Card className="p-6 border-2 border-green-200 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-800">Application Android</CardTitle>
                <CardDescription className="text-lg">
                  Version mobile optimisée pour Android
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Application sécurisée et fiable</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Interface rapide et intuitive</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Optimisée pour mobile</span>
                  </div>
                </div>

                {/* Avertissement pour les sources inconnues */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-amber-800 mb-2">⚠️ Installation requise</p>
                      <p className="text-amber-700">
                        Activez "Sources inconnues" dans les paramètres Android pour installer l'APK.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Bouton de téléchargement bien visible */}
                <div className="pt-4">
                  <Button 
                    onClick={handleDownloadAPK}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    size="lg"
                  >
                    <Download className="w-6 h-6 mr-3" />
                    📱 Télécharger APK Android
                  </Button>
                </div>
                
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500">
                    ✅ Compatible avec Android 6.0 et versions ultérieures
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Taille: ~10 MB • Version: 1.0.0
                  </p>
                </div>
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
                📋 Comment installer l'APK ?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">📥 Téléchargez l'APK</h4>
                    <p className="text-gray-600">Cliquez sur le bouton vert pour télécharger le fichier APK</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">🔓 Activez les sources inconnues</h4>
                    <p className="text-gray-600">Paramètres &gt; Sécurité &gt; Sources inconnues</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">📲 Installez l'application</h4>
                    <p className="text-gray-600">Ouvrez le fichier APK téléchargé et suivez les instructions</p>
                  </div>
                </div>
              </div>

              {/* Lien direct visible */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Lien direct de téléchargement:</p>
                <code className="text-xs bg-white p-2 rounded border break-all">
                  http://localhost:8081/FinderID.apk
                </code>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
