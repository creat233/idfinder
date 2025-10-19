import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { MCardVerifiedBadge } from "@/components/mcards/MCardVerifiedBadge";
import { MCardInteractionButtons } from "@/components/mcards/MCardInteractionButtons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Phone, Mail, Building, Eye, Heart, Search } from "lucide-react";
import { getFavoriteCards } from "@/services/mcardInteractionService";
import { MCard } from "@/types/mcard";
import { useToast } from "@/hooks/use-toast";

const MyFavorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<MCard[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<MCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavoriteCards();
      setFavorites(data);
      setFilteredFavorites(data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des favoris:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos favoris"
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

  const handleCardClick = (slug: string) => {
    navigate(`/mcard/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Chargement de vos favoris...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            Mes MCard Favoris
          </h1>
          <p className="text-lg text-gray-600">
            Toutes les cartes que vous avez ajoutées à vos favoris
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="🔍 Rechercher dans vos favoris..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-600 text-center">
              {filteredFavorites.length} résultat{filteredFavorites.length > 1 ? 's' : ''} trouvé{filteredFavorites.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {favorites.length} favori{favorites.length > 1 ? 's' : ''} {searchQuery && `• ${filteredFavorites.length} affiché${filteredFavorites.length > 1 ? 's' : ''}`}
          </Badge>
        </div>

        {/* Cards Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Vous n'avez encore aucun favori
            </p>
            <p className="text-gray-400">
              Explorez les MCard vérifiées et ajoutez-les à vos favoris
            </p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Aucun favori ne correspond à votre recherche
            </p>
            <p className="text-gray-400">
              Essayez avec d'autres mots-clés
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((mcard) => (
              <Card 
                key={mcard.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm"
                onClick={() => handleCardClick(mcard.slug)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={mcard.profile_picture_url || ''} />
                        <AvatarFallback>
                          {mcard.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{mcard.full_name}</h3>
                        {mcard.job_title && (
                          <p className="text-sm text-gray-600">{mcard.job_title}</p>
                        )}
                      </div>
                    </div>
                    <MCardVerifiedBadge isVerified={mcard.is_verified || false} />
                  </div>
                  
                  {mcard.company && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      {mcard.company}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {mcard.phone_number && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span>{mcard.phone_number}</span>
                      </div>
                    )}
                    {mcard.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="truncate">{mcard.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {mcard.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {mcard.description}
                    </p>
                  )}

                  {/* Plan Badge */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">
                      {mcard.plan === 'premium' ? 'Premium' : 'Essentiel'}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      {mcard.view_count || 0}
                    </div>
                  </div>

                  {/* Interactions */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <MCardInteractionButtons
                      mcardId={mcard.id}
                      mcardOwnerId={mcard.user_id}
                      mcardOwnerName={mcard.full_name}
                      className="justify-center"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;