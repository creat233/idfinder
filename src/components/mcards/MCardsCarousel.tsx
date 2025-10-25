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
    <section className="relative py-24 overflow-hidden">
      {/* Fond avec gradient et motifs */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-purple-100">
            <Star className="h-4 w-4 text-purple-600 fill-purple-600" />
            <span className="text-sm font-medium text-purple-900">Professionnels Vérifiés</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cartes Professionnelles
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez les profils vérifiés de nos professionnels
          </p>
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-2xl">
          <div className="flex space-x-8 pb-6 px-2">
            {mcards.map((mcard, index) => {
              const planBadge = mcard.plan === 'premium' 
                ? { 
                    text: 'PREMIUM', 
                    gradient: 'from-purple-600 to-purple-800',
                    bgColor: 'bg-white',
                    textColor: 'text-purple-700',
                    borderColor: 'border-purple-200'
                  }
                : { 
                    text: 'ESSENTIEL', 
                    gradient: 'from-blue-600 to-blue-800',
                    bgColor: 'bg-white',
                    textColor: 'text-blue-700',
                    borderColor: 'border-blue-200'
                  };

              return (
                <Link 
                  key={mcard.id}
                  to={`/mcard/${mcard.slug}`}
                  className="inline-block w-[380px] group"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fade-in 0.5s ease-out forwards'
                  }}
                >
                  <Card className="relative overflow-hidden bg-white backdrop-blur-sm transition-all duration-500 h-full border-0 shadow-lg hover:shadow-2xl group-hover:-translate-y-2">
                    {/* Header avec gradient */}
                    <div className={`relative h-40 bg-gradient-to-br ${planBadge.gradient} overflow-hidden`}>
                      {/* Badge Premium/Essentiel */}
                      <div className="absolute top-5 right-5 z-20">
                        <div className={`${planBadge.bgColor} ${planBadge.textColor} px-4 py-1.5 rounded-full shadow-lg border ${planBadge.borderColor} flex items-center gap-2 backdrop-blur-sm`}>
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-xs font-bold tracking-wide">{planBadge.text}</span>
                        </div>
                      </div>
                      
                      {/* Motifs décoratifs animés */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-8 right-12 w-32 h-32 rounded-full border-2 border-white/40 animate-pulse"></div>
                        <div className="absolute top-4 right-8 w-20 h-20 rounded-full border border-white/30"></div>
                        <div className="absolute bottom-8 left-12 w-24 h-24 rounded-full border-2 border-white/40"></div>
                        <div className="absolute bottom-4 left-8 w-16 h-16 rounded-full border border-white/30 animate-pulse delay-500"></div>
                      </div>

                      {/* Effet de brillance au hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>

                    <CardContent className="p-8 -mt-16 relative z-10">
                      {/* Photo de profil avec effet */}
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          {mcard.profile_picture_url ? (
                            <img 
                              src={mcard.profile_picture_url} 
                              alt={mcard.full_name}
                              className="w-28 h-28 rounded-full shadow-2xl border-4 border-white object-cover ring-4 ring-white/50 transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl flex items-center justify-center text-2xl font-bold text-gray-600 border-4 border-white ring-4 ring-white/50 transition-transform duration-300 group-hover:scale-110">
                              {mcard.full_name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                          
                          {/* Point de vérification */}
                          {mcard.is_verified && (
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                              <Star className="h-4 w-4 text-white fill-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Informations principales */}
                      <div className="text-center mb-6 space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate group-hover:text-purple-700 transition-colors">
                          {mcard.full_name}
                        </h3>
                        
                        {mcard.job_title && (
                          <p className={`text-base font-semibold mb-2 truncate ${mcard.plan === 'premium' ? 'text-purple-600' : 'text-blue-600'}`}>
                            {mcard.job_title}
                          </p>
                        )}
                        
                        {mcard.company && (
                          <div className="flex items-center justify-center gap-2 text-gray-600">
                            <Building className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm truncate font-medium">{mcard.company}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {mcard.description && (
                        <p className="text-sm text-gray-600 text-center line-clamp-2 mb-6 leading-relaxed px-2">
                          {mcard.description}
                        </p>
                      )}

                      {/* Badge de vérification */}
                      {mcard.is_verified && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50 backdrop-blur-sm">
                          <div className="flex items-center gap-2 text-green-700 justify-center">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-bold">Profil Vérifié</span>
                          </div>
                        </div>
                      )}

                      {/* Effet de fond au hover */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl"></div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="bg-gray-100" />
        </ScrollArea>

        {/* Indicateur de scroll */}
        <div className="flex justify-center mt-8 gap-2">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <div className="w-8 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
            <span>Faites défiler pour voir plus</span>
          </div>
        </div>
      </div>
    </section>
  );
};