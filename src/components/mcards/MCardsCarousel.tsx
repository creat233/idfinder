import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Building, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MCard } from "@/types/mcard";
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const MCardsCarousel = () => {
  const [mcards, setMCards] = useState<MCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifiedMCards();
  }, []);

  const fetchVerifiedMCards = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('mcards')
        .select('*')
        .eq('is_published', true)
        .eq('is_verified', true)
        .order('view_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMCards(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des mCards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (mcards.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cartes Vérifiées
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les mCards de professionnels vérifiés
          </p>
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-6 pb-4">
            {mcards.map((mcard) => {
              const planBadge = mcard.plan === 'premium' 
                ? { text: 'PREMIUM', color: 'bg-purple-100 text-purple-800' }
                : { text: 'ESSENTIEL', color: 'bg-blue-100 text-blue-800' };

              const gradient = mcard.plan === 'premium' 
                ? 'from-purple-600 to-purple-800'
                : 'from-blue-600 to-blue-800';

              return (
                <Link 
                  key={mcard.id}
                  to={`/mcard/${mcard.slug}`}
                  className="inline-block w-[350px] transition-transform hover:scale-105"
                >
                  <Card className="relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
                    <div className={`h-32 bg-gradient-to-br ${gradient} relative`}>
                      <div className="absolute top-4 right-4">
                        <Badge className={planBadge.color}>
                          <Star className="h-3 w-3 mr-1" />
                          {planBadge.text}
                        </Badge>
                      </div>
                      
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-6 right-6 w-20 h-20 rounded-full border-2 border-white"></div>
                        <div className="absolute bottom-6 left-6 w-12 h-12 rounded-full border border-white"></div>
                      </div>
                    </div>

                    <CardContent className="p-6 -mt-12 relative z-10">
                      <div className="flex justify-center mb-4">
                        {mcard.profile_picture_url ? (
                          <img 
                            src={mcard.profile_picture_url} 
                            alt={mcard.full_name}
                            className="w-24 h-24 rounded-full shadow-xl border-4 border-white object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-2xl font-bold text-gray-600 border-4 border-white">
                            {mcard.full_name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                      </div>

                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{mcard.full_name}</h3>
                        {mcard.job_title && (
                          <p className="text-sm text-blue-600 font-semibold mb-1 truncate">{mcard.job_title}</p>
                        )}
                        {mcard.company && (
                          <p className="text-sm text-gray-600 flex items-center justify-center gap-1 truncate">
                            <Building className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{mcard.company}</span>
                          </p>
                        )}
                      </div>

                      {mcard.description && (
                        <p className="text-sm text-gray-700 text-center line-clamp-2 mb-4">
                          {mcard.description}
                        </p>
                      )}

                      {mcard.is_verified && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 text-green-700 justify-center">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-xs font-semibold">Profil vérifié</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};