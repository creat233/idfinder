import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { ScanSearch, Plus, Search, Gift } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PublicHeroProps {
  user?: User | null;
  isLoading?: boolean;
}

export const PublicHero = ({ user, isLoading }: PublicHeroProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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

  const handlePromoCodesAction = () => {
    if (user) {
      // User is logged in, go to promo codes page
      navigate("/promo-codes");
    } else {
      // User is not logged in, go to login page
      navigate("/login");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez entrer un numéro de pièce d'identité pour rechercher",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      // Recherche dans la base de données
      const { data, error } = await supabase
        .from('reported_cards')
        .select('*')
        .eq('card_number', searchQuery.trim())
        .eq('status', 'pending')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        toast({
          title: "Carte trouvée !",
          description: "Votre document a été trouvé. Redirection en cours...",
        });
        // Rediriger vers une page de détails ou afficher les résultats
        navigate(`/recherche-resultat?id=${data.id}`);
      } else {
        toast({
          title: "Carte non trouvée",
          description: "Votre carte n'a pas encore été signalée. Nous vous notifierons dès qu'elle sera publiée.",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
            
            {/* Barre de recherche */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-semibold mb-3 text-white">
                  🔍 Recherchez votre carte perdue
                </h3>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Entrez le numéro de votre carte (ex: 123456789)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 bg-white border-white/20 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                        Recherche...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Rechercher
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-purple-200 mt-2">
                  Entrez le numéro de votre carte d'identité, permis ou passeport
                </p>
              </div>
            </motion.div>
            
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
                  className="border-2 border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 text-lg bg-transparent"
                >
                  {user ? (
                    <>
                      <ScanSearch className="mr-2 h-5 w-5" />
                      Mes cartes
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Voir la démo
                    </>
                  )}
                </Button>
                {user && (
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={handlePromoCodesAction}
                    className="border-2 border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 text-lg bg-transparent"
                  >
                    <Gift className="mr-2 h-5 w-5" />
                    Codes promo
                  </Button>
                )}
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
