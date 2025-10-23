
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Share2, Phone, Mail, Globe, Building, Clock, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { MCard } from "@/types/mcard";

export const MCardDemo = () => {
  const [featuredMCard, setFeaturedMCard] = useState<MCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchFeaturedMCard();
  }, []);

  const fetchFeaturedMCard = async () => {
    try {
      setLoading(true);
      
      // Récupérer la mCard sponsorisée
      const { data: featuredData, error: featuredError } = await supabase
        .from('featured_mcards')
        .select('mcard_id')
        .eq('is_active', true)
        .single();

      if (featuredError && featuredError.code !== 'PGRST116') throw featuredError;

      if (featuredData) {
        const { data: mcardData, error: mcardError } = await supabase
          .from('mcards')
          .select('*')
          .eq('id', featuredData.mcard_id)
          .eq('is_published', true)
          .single();

        if (mcardError) throw mcardError;
        setFeaturedMCard(mcardData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la mCard sponsorisée:', error);
    } finally {
      setLoading(false);
    }
  };

  // Si aucune mCard sponsorisée, ne rien afficher
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!featuredMCard) {
    return null;
  }

  const planBadge = featuredMCard.plan === 'premium' 
    ? { text: 'PREMIUM', color: 'bg-purple-100 text-purple-800' }
    : { text: 'ESSENTIEL', color: 'bg-blue-100 text-blue-800' };

  const gradient = featuredMCard.plan === 'premium' 
    ? 'from-purple-600 to-purple-800'
    : 'from-blue-600 to-blue-800';

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Exemple de mCard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez à quoi ressemble une mCard professionnelle
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Carte de démonstration */}
          <div className="relative">
            <div 
              className={cn(
                "transition-all duration-300 transform",
                isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"
              )}
            >
              <Card className="relative overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <div className={cn("h-48 bg-gradient-to-br", gradient, "relative")}>
                  {/* Badge du plan */}
                  <div className="absolute top-4 right-4">
                    <Badge className={planBadge.color}>
                      <Star className="h-3 w-3 mr-1" />
                      {planBadge.text}
                    </Badge>
                  </div>
                  
                  {/* Motifs décoratifs */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-2 border-white"></div>
                    <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full border border-white"></div>
                  </div>
                </div>

                <CardContent className="p-8 -mt-16 relative z-10">
                  {/* Photo de profil */}
                  <div className="flex justify-center mb-6">
                    {featuredMCard.profile_picture_url ? (
                      <img 
                        src={featuredMCard.profile_picture_url} 
                        alt={featuredMCard.full_name}
                        className="w-32 h-32 rounded-full shadow-xl border-4 border-white object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center text-4xl font-bold text-gray-600 border-4 border-white">
                        {featuredMCard.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>

                  {/* Informations principales */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{featuredMCard.full_name}</h3>
                    {featuredMCard.job_title && (
                      <p className="text-lg text-blue-600 font-semibold mb-1">{featuredMCard.job_title}</p>
                    )}
                    {featuredMCard.company && (
                      <p className="text-gray-600 flex items-center justify-center gap-1">
                        <Building className="h-4 w-4" />
                        {featuredMCard.company}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  {featuredMCard.description && (
                    <p className="text-gray-700 text-center mb-8 leading-relaxed">
                      {featuredMCard.description}
                    </p>
                  )}

                  {/* Informations de contact */}
                  <div className="space-y-4 mb-8">
                    {featuredMCard.phone_number && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Phone className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-700">{featuredMCard.phone_number}</span>
                      </div>
                    )}
                    {featuredMCard.email && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-700">{featuredMCard.email}</span>
                      </div>
                    )}
                    {featuredMCard.website_url && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-700">{featuredMCard.website_url}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button className="flex-1" size="lg">
                      <QrCode className="h-5 w-5 mr-2" />
                      QR Code
                    </Button>
                    <Button variant="outline" className="flex-1" size="lg">
                      <Share2 className="h-5 w-5 mr-2" />
                      Partager
                    </Button>
                  </div>

                  {/* Badge vérifié */}
                  {featuredMCard.is_verified && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-semibold">Profil vérifié</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Indicateurs visuels */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>

          {/* Fonctionnalités du plan */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900">
                Fonctionnalités du plan {planBadge.text}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Informations professionnelles complètes</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Réseaux sociaux intégrés</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Partage en un clic</span>
                </div>
                {featuredMCard.plan === 'premium' && (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Statuts personnalisés</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Catalogue produits</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Statistiques réelles */}
            {featuredMCard.view_count && featuredMCard.view_count > 0 && (
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Statistiques
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{featuredMCard.view_count}</div>
                    <div className="text-sm text-gray-600">Vues totales</div>
                  </div>
                </div>
              </Card>
            )}

            {/* CTA */}
            <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h4 className="text-xl font-semibold mb-2">Prêt à créer votre carte ?</h4>
              <p className="text-blue-100 mb-4">Rejoignez des milliers de professionnels qui utilisent nos cartes digitales.</p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto">
                Commencer maintenant
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
