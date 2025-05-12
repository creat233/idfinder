
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FoundCardResult } from "@/components/card-report/FoundCardResult";

export const Hero = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundCard, setFoundCard] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: "Veuillez entrer un numéro de carte",
        description: "Le champ de recherche ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setFoundCard(null);
    
    try {
      // Rechercher la carte et joindre les informations du profil pour avoir le numéro de téléphone
      const { data, error } = await supabase
        .from('reported_cards')
        .select(`
          *,
          profiles:reporter_id (
            phone
          )
        `)
        .ilike('card_number', `%${searchQuery}%`)
        .maybeSingle();

      if (error) {
        console.error("Search error:", error);
        setSearchError("Une erreur s'est produite lors de la recherche. Veuillez réessayer.");
        throw error;
      }

      if (data) {
        setFoundCard(data);
        toast({
          title: "Carte trouvée !",
          description: "Une carte correspondant à votre recherche a été trouvée.",
        });
      } else {
        setFoundCard(null);
        toast({
          title: "Aucune carte trouvée",
          description: "Aucune carte correspondant à votre recherche n'a été trouvée.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Search error details:", error);
      setSearchError(error.message || "Une erreur s'est produite lors de la recherche");
      toast({
        title: "Erreur de recherche",
        description: "Une erreur s'est produite lors de la recherche. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 to-white overflow-hidden">
      {/* Cercles décoratifs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-secondary/10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary/10 translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight"
          >
            Retrouvez vos papiers d'identité perdus
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 mb-10"
          >
            Une solution simple, sécurisée et efficace pour récupérer vos documents d'identité égarés
          </motion.p>
          
          <motion.form 
            onSubmit={handleSearch} 
            variants={itemVariants}
            className="max-w-2xl mx-auto mb-10 relative"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Entrez le numéro de votre pièce d'identité..."
                  className="pl-10 py-6 text-lg w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isSearching}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSearching}
                size="lg"
                className="py-6 px-8 w-full sm:w-auto"
              >
                {isSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Rechercher
                  </>
                )}
              </Button>
            </div>
            
            {searchError && (
              <p className="text-destructive text-sm mt-2">{searchError}</p>
            )}
          </motion.form>

          {foundCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <FoundCardResult cardData={foundCard} />
            </motion.div>
          )}

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              onClick={() => navigate("/signaler")}
              className="bg-secondary hover:bg-secondary/90 py-6 px-8 text-lg group"
            >
              Signaler une carte trouvée
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/support")}
              className="py-6 px-8 text-lg"
            >
              Comment ça marche ?
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
