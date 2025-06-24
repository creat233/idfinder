
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Share2, Phone, Mail, Globe, MapPin, Building, User, Clock, Star, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export const MCardDemo = () => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'essential' | 'premium'>('free');
  const [isAnimating, setIsAnimating] = useState(false);

  const demoCards = {
    free: {
      name: "Marie Diallo",
      title: "Consultante",
      company: "Freelance",
      phone: "+221 77 123 45 67",
      email: "marie.diallo@example.com",
      website: "www.mariediallo.com",
      description: "Consultante en marketing digital avec 3 ans d'expérience.",
      gradient: "from-gray-600 to-gray-800",
      features: ["Informations de base", "QR Code", "Partage simple"],
      badge: { text: "GRATUIT", color: "bg-gray-100 text-gray-800" },
      icon: <User className="h-4 w-4" />
    },
    essential: {
      name: "Jean Dupont",
      title: "Développeur Full Stack",
      company: "TechCorp Solutions",
      phone: "+221 77 123 45 67",
      email: "jean.dupont@example.com",
      website: "www.jeandupont.com",
      description: "Passionné de technologie avec 5 ans d'expérience dans le développement web. Spécialisé en React, Node.js et bases de données.",
      gradient: "from-blue-600 to-blue-800",
      features: ["Réseaux sociaux", "Statistiques", "Mise à jour temps réel"],
      badge: { text: "ESSENTIEL", color: "bg-blue-100 text-blue-800" },
      icon: <Zap className="h-4 w-4" />
    },
    premium: {
      name: "Fatou Sané",
      title: "Directrice Marketing",
      company: "Innovation Hub Dakar",
      phone: "+221 77 123 45 67",
      email: "fatou.sane@example.com",
      website: "www.fatousane.pro",
      description: "Leader en marketing digital et innovation. Experte en stratégies de croissance pour startups et PME. Mentore et formatrice reconnue.",
      gradient: "from-purple-600 to-purple-800",
      features: ["Statuts personnalisés", "Catalogue produits", "Analytics avancées"],
      badge: { text: "PREMIUM", color: "bg-purple-100 text-purple-800" },
      icon: <Crown className="h-4 w-4" />
    }
  };

  const currentCard = demoCards[selectedPlan];

  const handlePlanChange = (plan: 'free' | 'essential' | 'premium') => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedPlan(plan);
      setIsAnimating(false);
    }, 150);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Démonstration Interactive
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les différentes versions de nos cartes de visite digitales
          </p>
        </div>

        {/* Sélecteur de plan */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          {Object.entries(demoCards).map(([planId, card]) => (
            <Button
              key={planId}
              variant={selectedPlan === planId ? "default" : "outline"}
              size="lg"
              onClick={() => handlePlanChange(planId as 'free' | 'essential' | 'premium')}
              className={cn(
                "flex items-center gap-2 transition-all duration-300",
                selectedPlan === planId && "scale-105 shadow-lg"
              )}
            >
              {card.icon}
              <span className="font-semibold">{card.badge.text}</span>
            </Button>
          ))}
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
                <div className={cn("h-48 bg-gradient-to-br", currentCard.gradient, "relative")}>
                  {/* Badge du plan */}
                  <div className="absolute top-4 right-4">
                    <Badge className={currentCard.badge.color}>
                      {currentCard.badge.text}
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
                    <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center text-4xl font-bold text-gray-600 border-4 border-white">
                      {currentCard.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentCard.name}</h3>
                    <p className="text-lg text-blue-600 font-semibold mb-1">{currentCard.title}</p>
                    <p className="text-gray-600 flex items-center justify-center gap-1">
                      <Building className="h-4 w-4" />
                      {currentCard.company}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-center mb-8 leading-relaxed">
                    {currentCard.description}
                  </p>

                  {/* Informations de contact */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">{currentCard.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">{currentCard.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">{currentCard.website}</span>
                    </div>
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

                  {/* Statut pour Premium */}
                  {selectedPlan === 'premium' && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold">En ligne • Disponible pour nouveaux projets</span>
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
                Fonctionnalités du plan {currentCard.badge.text}
              </h3>
              
              <div className="space-y-4">
                {currentCard.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistiques simulées */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Statistiques temps réel
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-gray-600">Vues totales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">89</div>
                  <div className="text-sm text-gray-600">Contacts ce mois</div>
                </div>
              </div>
            </Card>

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
