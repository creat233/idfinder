
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface SearchSectionProps {
  user?: User | null;
}

export const SearchSection = ({ user }: SearchSectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showNotFoundAction, setShowNotFoundAction] = useState(false);

  // Ne pas afficher la section de recherche si l'utilisateur n'est pas connecté
  if (!user) {
    return null;
  }

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
    setShowNotFoundAction(false);

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
        navigate(`/recherche/${data.card_number}`);
      } else {
        setShowNotFoundAction(true);
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

  const handleAddToMyCards = () => {
    if (!searchQuery.trim()) return;
    navigate(`/mes-cartes?ajouter=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
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
              placeholder="Entrez le numéro de carte : CNI, passeport, permis, carte grise, séjour, étudiante ou santé"
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
          Entrez le numéro de votre carte d'identité, passeport, permis, carte grise véhicule/moto, séjour, étudiante ou santé
        </p>
        {showNotFoundAction && (
          <div className="mt-5 bg-violet-50/80 border border-violet-300 rounded-lg p-4 flex flex-col items-center gap-2">
            <div className="text-violet-700 font-medium flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Recevez une notification automatique si cette carte est retrouvée !
            </div>
            <p className="text-violet-600 text-sm mb-2 text-center">
              Ajoutez ce numéro à <span className="font-semibold">“Mes cartes”</span> pour recevoir une alerte dès qu’il sera signalé sur FinderID.
            </p>
            <Button
              variant="default"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6"
              onClick={handleAddToMyCards}
            >
              + Ajouter ce numéro à Mes cartes
            </Button>
            <p className="text-xs text-violet-500 mt-1">
              Vous retrouverez toutes vos cartes sous “Mes cartes”.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
