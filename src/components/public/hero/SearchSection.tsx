
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useTranslation } from "@/hooks/useTranslation";

interface SearchSectionProps {
  user?: User | null;
}

export const SearchSection = ({ user }: SearchSectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showNotFoundAction, setShowNotFoundAction] = useState(false);
  const { t } = useTranslation();

  // Ne pas afficher la section de recherche si l'utilisateur n'est pas connecté
  if (!user) {
    return null;
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: t("toast_field_required_title"),
        description: t("toast_field_required_desc"),
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
          title: t("toast_card_found_title"),
          description: t("toast_card_found_desc_redirecting"),
        });
        // Rediriger vers une page de détails ou afficher les résultats
        navigate(`/recherche/${data.card_number}`);
      } else {
        setShowNotFoundAction(true);
        toast({
          title: t("toast_card_not_found_title"),
          description: t("toast_card_not_found_desc"),
        });
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: t("toast_search_error_title"),
        description: t("toast_search_error_desc"),
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
          🔍 {t("search_your_card")}
        </h3>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder={t("search_placeholder_generic")}
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
                {t("searching")}
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                {t("search")}
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-purple-200 mt-2">
          {t("search_description_generic")}
        </p>
        {showNotFoundAction && (
          <div className="mt-5 bg-violet-50/80 border border-violet-300 rounded-lg p-4 flex flex-col items-center gap-2">
            <div className="text-violet-700 font-medium flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              {t("search_not_found_notification_prompt")}
            </div>
            <p className="text-violet-600 text-sm mb-2 text-center">
              {t("search_not_found_add_to_my_cards_prompt")}
            </p>
            <Button
              variant="default"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6"
              onClick={handleAddToMyCards}
            >
              {t("search_not_found_add_to_my_cards_button")}
            </Button>
            <p className="text-xs text-violet-500 mt-1">
              {t("search_not_found_my_cards_info")}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
