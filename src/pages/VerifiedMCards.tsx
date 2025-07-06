import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { MCardSearchBar } from "@/components/mcards/MCardSearchBar";
import { MCardVerifiedBadge } from "@/components/mcards/MCardVerifiedBadge";
import { MCardInteractionButtons } from "@/components/mcards/MCardInteractionButtons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Building, MapPin, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MCard } from "@/types/mcard";
import { useToast } from "@/hooks/use-toast";

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
    window.open(`/mcard/${slug}`, '_blank');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <PublicHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MCard Vérifiées ✅
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Découvrez les cartes professionnelles vérifiées et authentifiées
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <MCardSearchBar 
              onSearch={handleSearch}
              placeholder="Rechercher par nom, entreprise, téléphone, produit, service..."
            />
          </div>
        </div>

        {/* Stats */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {filteredMCards.length} carte{filteredMCards.length > 1 ? 's' : ''} vérifiée{filteredMCards.length > 1 ? 's' : ''} trouvée{filteredMCards.length > 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Cards Grid */}
        {filteredMCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'Aucune carte trouvée pour cette recherche' : 'Aucune carte vérifiée disponible'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMCards.map((mcard) => (
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
      
      <Footer />
    </div>
  );
};

export default VerifiedMCards;