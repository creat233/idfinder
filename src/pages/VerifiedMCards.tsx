import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { MCardSearchBar } from "@/components/mcards/MCardSearchBar";
import { MCardVerifiedBadge } from "@/components/mcards/MCardVerifiedBadge";
import { MCardInteractionButtons } from "@/components/mcards/MCardInteractionButtons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Building, MapPin, Eye, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MCard } from "@/types/mcard";
import { useToast } from "@/hooks/use-toast";
import { URL_CONFIG } from "@/utils/urlConfig";

const VerifiedMCards = () => {
  const [mcards, setMCards] = useState<MCard[]>([]);
  const [filteredMCards, setFilteredMCards] = useState<MCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadVerifiedMCards();
  }, []);

  useEffect(() => {
    filterMCards();
  }, [mcards, searchQuery]);

  const loadVerifiedMCards = async () => {
    try {
      const { data, error } = await supabase
        .from('mcards')
        .select('*')
        .eq('is_published', true)
        .eq('is_verified', true)
        .eq('subscription_status', 'active')
        .order('view_count', { ascending: false });

      if (error) throw error;
      setMCards(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les cartes vérifiées"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMCards = () => {
    if (!searchQuery.trim()) {
      setFilteredMCards(mcards);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = mcards.filter(mcard => 
      mcard.full_name?.toLowerCase().includes(query) ||
      mcard.company?.toLowerCase().includes(query) ||
      mcard.job_title?.toLowerCase().includes(query) ||
      mcard.phone_number?.includes(query) ||
      mcard.email?.toLowerCase().includes(query)
    );

    setFilteredMCards(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCardClick = (slug: string) => {
    // Toujours utiliser le domaine finderid.info pour les liens de cartes
    const cardUrl = `https://www.finderid.info/mcard/${slug}`;
    window.open(cardUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <PublicHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Chargement des cartes vérifiées...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <PublicHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header amélioré */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            MCards Vérifiées
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Découvrez notre sélection de cartes professionnelles <span className="font-semibold text-blue-600">vérifiées et authentifiées</span> par notre équipe. 
            Faites confiance aux professionnels certifiés pour vos besoins.
          </p>
          
          {/* Search Bar améliorée */}
          <div className="max-w-3xl mx-auto">
            <MCardSearchBar 
              onSearch={handleSearch}
              placeholder="🔍 Rechercher par nom, entreprise, secteur d'activité, service..."
              className="shadow-xl"
            />
          </div>
        </div>

        {/* Stats améliorées */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-full px-6 py-3 shadow-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-semibold text-gray-800">
              {filteredMCards.length} professionnel{filteredMCards.length > 1 ? 's' : ''} vérifié{filteredMCards.length > 1 ? 's' : ''} 
              {searchQuery && ' trouvé' + (filteredMCards.length > 1 ? 's' : '')}
            </span>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>

        {/* Cards Grid améliorée */}
        {filteredMCards.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'Aucun résultat trouvé' : 'Aucune carte vérifiée'}
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? 'Essayez avec d\'autres mots-clés ou affinez votre recherche' 
                  : 'Les premières cartes vérifiées apparaîtront bientôt ici'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMCards.map((mcard) => (
              <Card 
                key={mcard.id} 
                className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
                onClick={() => handleCardClick(mcard.slug)}
              >
                <CardHeader className="pb-3 relative">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-14 h-14 ring-2 ring-white shadow-lg">
                            <AvatarImage src={mcard.profile_picture_url || ''} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                              {mcard.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          {/* Badge vérifié en overlay */}
                          <div className="absolute -top-1 -right-1">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {mcard.full_name}
                          </h3>
                          {mcard.job_title && (
                            <p className="text-sm text-gray-600 font-medium truncate">{mcard.job_title}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {mcard.company && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Building className="w-4 h-4 text-blue-500" />
                        <span className="truncate">{mcard.company}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 relative z-10">
                  {/* Contact Info avec icônes colorées */}
                  <div className="space-y-3">
                    {mcard.phone_number && (
                      <div className="flex items-center gap-3 text-sm bg-green-50 rounded-lg p-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-medium text-green-800">{mcard.phone_number}</span>
                      </div>
                    )}
                    {mcard.email && (
                      <div className="flex items-center gap-3 text-sm bg-blue-50 rounded-lg p-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-blue-800 truncate">{mcard.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Description avec gradient */}
                  {mcard.description && (
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                        {mcard.description}
                      </p>
                    </div>
                  )}

                  {/* Stats et badges */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`capitalize font-semibold ${
                          mcard.plan === 'premium' 
                            ? 'border-purple-200 text-purple-700 bg-purple-50' 
                            : 'border-blue-200 text-blue-700 bg-blue-50'
                        }`}
                      >
                        {mcard.plan === 'premium' ? '✨ Premium' : '🎯 Essentiel'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                      <Eye className="w-3 h-3" />
                      <span className="font-medium">{mcard.view_count || 0}</span>
                    </div>
                  </div>

                  {/* Bouton d'action principal */}
                  <div className="pt-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-0.5 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                      <div className="bg-white rounded-md px-4 py-2 text-center">
                        <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Voir le profil →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactions en bas */}
                  <div onClick={(e) => e.stopPropagation()} className="pt-2 border-t border-gray-100">
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
      
      <Footer />
    </div>
  );
};

export default VerifiedMCards;
