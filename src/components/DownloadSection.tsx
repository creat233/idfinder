import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Shield, Zap, AlertCircle, ExternalLink, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const DownloadSection = () => {
  const { toast } = useToast();
  const [showDirectLink, setShowDirectLink] = useState(false);
  const downloadUrl = '/FinderID (1).apk';

  const handleDownloadAPK = () => {
    try {
      // Créer un lien de téléchargement direct vers le fichier APK local
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'FinderID.apk';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Téléchargement commencé",
        description: "Le fichier APK FinderID est en cours de téléchargement",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le fichier APK",
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      const fullUrl = window.location.origin + downloadUrl;
      await navigator.clipboard.writeText(fullUrl);
      toast({
        title: "Lien copié !",
        description: "Vous pouvez maintenant le coller dans votre navigateur",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le lien",
      });
    }
  };

  const handleDirectLink = () => {
    window.open(downloadUrl, '_blank');
    toast({
      title: "Ouverture du lien",
      description: "Le téléchargement devrait commencer automatiquement",
    });
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
                
                {/* Boutons de téléchargement */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleDownloadAPK}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    size="lg"
                  >
                    <Download className="w-6 h-6 mr-3" />
                    📱 Télécharger APK Android
                  </Button>

                  {/* Boutons alternatifs pour mobile */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={handleDirectLink}
                      variant="outline"
                      className="text-sm py-2"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Lien direct
                    </Button>
                    <Button 
                      onClick={handleCopyLink}
                      variant="outline"
                      className="text-sm py-2"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copier lien
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={() => setShowDirectLink(!showDirectLink)}
                    variant="ghost"
                    className="w-full text-sm text-gray-600"
                  >
                    {showDirectLink ? 'Masquer' : 'Afficher'} le lien de téléchargement
                  </Button>
                  
                  {showDirectLink && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Lien direct :</p>
                      <div className="bg-white p-2 rounded border text-xs font-mono break-all select-all">
                        {window.location.origin + downloadUrl}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Copiez ce lien et collez-le dans votre navigateur mobile
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500">
                    ✅ Compatible avec Android 6.0 et versions ultérieures
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    FinderID APK • Version: 1.0.0
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
                    <p className="text-gray-600">Cliquez sur le bouton vert ou utilisez le lien direct</p>
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

              {/* Conseils pour mobile */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">💡 Conseils pour mobile :</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Si le téléchargement ne démarre pas, utilisez le "Lien direct"</li>
                  <li>• Vous pouvez copier le lien et l'ouvrir dans un autre navigateur</li>
                  <li>• Assurez-vous d'avoir une connexion internet stable</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
