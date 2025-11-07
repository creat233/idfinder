import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, Sparkles, TrendingUp, Home } from "lucide-react";
import { getFavoriteCards } from "@/services/mcardInteractionService";
import { MCard } from "@/types/mcard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { offlineStorage } from "@/services/offlineStorage";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { supabase } from "@/integrations/supabase/client";
import { VerifiedMCardItem } from "@/components/verified/VerifiedMCardItem";
import { PaidMCardWithProducts } from "@/components/verified/PaidMCardWithProducts";

const MyFavorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<MCard[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<MCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { isOnline } = useOfflineSync();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Si hors ligne ou pas de session, charger depuis le stockage local
      if (!isOnline || !session) {
        const offlineMCards = offlineStorage.getAllMCards();
        // Filtrer uniquement les cartes qui étaient en favoris (on peut stocker une liste de favoris hors ligne)
        setFavorites(offlineMCards);
        setFilteredFavorites(offlineMCards);
        setLoading(false);
        return;
      }

      const data = await getFavoriteCards();
      setFavorites(data);
      setFilteredFavorites(data);
      
      // Sauvegarder pour le mode hors ligne
      data.forEach(card => offlineStorage.saveMCard(card));
    } catch (error: any) {
      console.error('Erreur lors du chargement des favoris:', error);
      
      // En cas d'erreur, essayer de charger depuis le cache
      const offlineMCards = offlineStorage.getAllMCards();
      setFavorites(offlineMCards);
      setFilteredFavorites(offlineMCards);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Chargement depuis le cache local"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les favoris selon la recherche
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFavorites(favorites);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = favorites.filter(card => 
        card.full_name?.toLowerCase().includes(query) ||
        card.company?.toLowerCase().includes(query) ||
        card.job_title?.toLowerCase().includes(query) ||
        card.email?.toLowerCase().includes(query) ||
        card.description?.toLowerCase().includes(query)
      );
      setFilteredFavorites(filtered);
    }
  }, [searchQuery, favorites]);

  // Séparer les cartes gratuites et payantes
  const freeCards = filteredFavorites.filter(mcard => mcard.plan === 'free');
  const paidCards = filteredFavorites.filter(mcard => mcard.plan !== 'free');

  const handleCardClick = (slug: string) => {
    navigate(`/mcard/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Chargement de vos favoris...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-10">
        {/* Bouton Retour à l'accueil */}
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Button>
        </div>

        {/* Enhanced Header avec gradient */}
        <div className="relative mb-8 sm:mb-10 lg:mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <Heart className="relative w-12 h-12 sm:w-14 sm:h-14 text-primary fill-primary animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  Mes mCards Favoris
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Retrouvez en un clin d'œil toutes les cartes que vous avez sauvegardées
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8 max-w-2xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">Total favoris</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{favorites.length}</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">Affichés</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{filteredFavorites.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                placeholder="Rechercher par nom, entreprise, poste..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 sm:pl-12 pr-4 h-12 sm:h-14 border-0 bg-transparent text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          {searchQuery && (
            <div className="mt-3 text-xs sm:text-sm text-center">
              <Badge variant="secondary" className="px-3 py-1">
                <Search className="w-3 h-3 mr-1.5" />
                {filteredFavorites.length} résultat{filteredFavorites.length > 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <Heart className="relative w-20 h-20 sm:w-24 sm:h-24 text-muted-foreground/30 mx-auto" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
              Aucun favori pour le moment
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-6">
              Découvrez les mCards vérifiées et ajoutez-les à vos favoris pour les retrouver facilement
            </p>
            <Badge 
              variant="outline" 
              className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition-all"
              onClick={() => navigate('/mcard-verified')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Commencez à explorer
            </Badge>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <Search className="relative w-20 h-20 sm:w-24 sm:h-24 text-muted-foreground/30 mx-auto" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
              Aucun résultat trouvé
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              Essayez avec d'autres mots-clés ou effacez votre recherche
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Cartes gratuites - Format simple */}
            {freeCards.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6 px-2">
                  Cartes Gratuites
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {freeCards.map((mcard) => (
                    <VerifiedMCardItem key={mcard.id} mcard={mcard} />
                  ))}
                </div>
              </div>
            )}

            {/* Cartes payantes - Avec produits/services */}
            {paidCards.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6 px-2">
                  Professionnels Premium
                </h2>
                <div className="max-w-2xl mx-auto space-y-6">
                  {paidCards.map((mcard) => (
                    <PaidMCardWithProducts key={mcard.id} mcard={mcard} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;