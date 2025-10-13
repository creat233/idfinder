import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Globe, Eye, CreditCard } from "lucide-react";
import { MCard } from "@/types/mcard";
import { Skeleton } from "@/components/ui/skeleton";

interface UnverifiedMCardsGridProps {
  searchQuery: string;
  selectedCategory: string;
}

export const UnverifiedMCardsGrid = ({ searchQuery, selectedCategory }: UnverifiedMCardsGridProps) => {
  const [mcards, setMCards] = useState<MCard[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUnverifiedMCards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mcards')
        .select('*')
        .eq('is_published', true)
        .eq('subscription_status', 'active')
        .or('is_verified.is.null,is_verified.eq.false')
        .order('view_count', { ascending: false });

      if (error) throw error;
      setMCards(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des MCards non vérifiées:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnverifiedMCards();
  }, []);

  const filteredMCards = mcards.filter(mcard => {
    const matchesSearch = 
      mcard.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mcard.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mcard.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mcard.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const handleViewCard = (slug: string) => {
    navigate(`/m/${slug}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (filteredMCards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="text-center p-12">
          <CardTitle className="text-2xl mb-4">Aucune MCard non vérifiée trouvée</CardTitle>
          <CardDescription>
            {searchQuery 
              ? "Essayez de modifier votre recherche"
              : "Il n'y a pas encore de MCards non vérifiées publiées"}
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          MCards Non Vérifiées
        </h2>
        <p className="text-gray-300">
          {filteredMCards.length} carte{filteredMCards.length > 1 ? 's' : ''} trouvée{filteredMCards.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMCards.map((mcard) => (
          <Card 
            key={mcard.id} 
            className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/95 backdrop-blur"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src={mcard.profile_picture_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                    {mcard.full_name?.slice(0, 2).toUpperCase() || "MC"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-1">
                    {mcard.full_name}
                  </CardTitle>
                  {mcard.job_title && (
                    <CardDescription className="text-sm line-clamp-1">
                      {mcard.job_title}
                    </CardDescription>
                  )}
                  {mcard.company && (
                    <CardDescription className="text-xs line-clamp-1 mt-1">
                      {mcard.company}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {mcard.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {mcard.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {mcard.phone_number && (
                  <a 
                    href={`tel:${mcard.phone_number}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="h-3 w-3" />
                    Appeler
                  </a>
                )}
                {mcard.email && (
                  <a 
                    href={`mailto:${mcard.email}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail className="h-3 w-3" />
                    Email
                  </a>
                )}
                {mcard.website_url && (
                  <a 
                    href={mcard.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe className="h-3 w-3" />
                    Site web
                  </a>
                )}
              </div>

              <Button 
                onClick={() => handleViewCard(mcard.slug)}
                className="w-full"
                variant="default"
              >
                Voir la carte
              </Button>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-xs">
                    <CreditCard className="h-3 w-3 mr-1" />
                    {mcard.plan === 'free' ? 'Gratuit' : 
                     mcard.plan === 'essential' ? 'Essentiel' : 'Premium'}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {mcard.view_count || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
