
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const PublicHero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Retrouvez vos <span className="text-yellow-300">documents perdus</span> en un clic
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              FinderID révolutionne la récupération de documents perdus au Sénégal. 
              Signalez, trouvez et récupérez vos pièces d'identité rapidement et en toute sécurité.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/login")}
                className="bg-white text-[#9b87f5] hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
              >
                Commencer maintenant
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate("/demo")}
                className="border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 text-lg"
              >
                Voir la démo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-green-300">Carte signalée</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-300">Notification envoyée</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-300">Récupération organisée</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
