
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { CardSearch, Plus, Search } from "lucide-react";

interface PublicHeroProps {
  user?: User | null;
  isLoading?: boolean;
}

export const PublicHero = ({ user, isLoading }: PublicHeroProps) => {
  const navigate = useNavigate();

  const handlePrimaryAction = () => {
    if (user) {
      // User is logged in, go to signaler page
      navigate("/signaler");
    } else {
      // User is not logged in, go to login page
      navigate("/login");
    }
  };

  const handleSecondaryAction = () => {
    if (user) {
      // User is logged in, go to mes-cartes page
      navigate("/mes-cartes");
    } else {
      // User is not logged in, show demo
      navigate("/demo");
    }
  };

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
            
            {!isLoading && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={handlePrimaryAction}
                  className="bg-white text-[#9b87f5] hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                >
                  {user ? (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Signaler une carte
                    </>
                  ) : (
                    "Commencer maintenant"
                  )}
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={handleSecondaryAction}
                  className="border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 text-lg"
                >
                  {user ? (
                    <>
                      <CardSearch className="mr-2 h-5 w-5" />
                      Mes cartes
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Voir la démo
                    </>
                  )}
                </Button>
              </div>
            )}

            {user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
              >
                <p className="text-purple-100 text-sm">
                  👋 Bienvenue ! Vous pouvez maintenant signaler des cartes trouvées ou gérer vos cartes perdues.
                </p>
              </motion.div>
            )}
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
