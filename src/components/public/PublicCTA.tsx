
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const PublicCTA = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDownloadAPK = () => {
    const link = document.createElement('a');
    link.href = '/FinderID (1).apk';
    link.download = 'FinderID.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement démarré",
      description: "L'application FinderID est en cours de téléchargement",
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à ne plus perdre vos documents ?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté solidaire dès aujourd'hui et participez à un Sénégal 
            où personne ne perd définitivement ses documents.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => navigate("/login")}
              className="bg-white text-[#9b87f5] hover:bg-gray-100 font-semibold px-8 py-4 rounded-full shadow-lg"
            >
              <Smartphone className="mr-3 h-6 w-6" />
              Commencer sur le web
            </Button>
            <Button 
              onClick={handleDownloadAPK}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 rounded-full"
            >
              <Download className="mr-3 h-6 w-6" />
              Télécharger l'app Android
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">+1000</div>
              <div className="text-purple-200">Documents retrouvés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24h</div>
              <div className="text-purple-200">Temps moyen</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-purple-200">Sécurisé</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">🇸🇳</div>
              <div className="text-purple-200">Fait au Sénégal</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
