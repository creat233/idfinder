
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Share2, Eye, Smartphone, Users, TrendingUp, Leaf } from "lucide-react";

export const MCardShowcase = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Votre Carte de Visite du Futur
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez comment nos cartes digitales transforment la façon dont vous partagez vos informations professionnelles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Démonstration visuelle - Responsive */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-2xl transform hover:rotate-0 transition-transform duration-300 rotate-1 sm:rotate-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg sm:text-xl font-bold">JD</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold truncate">Jean Dupont</h3>
                    <p className="text-blue-200 text-sm sm:text-base">Entrepreneur Digital</p>
                  </div>
                </div>
                <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-blue-300 flex-shrink-0" />
              </div>
              
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">+221 77 123 45 67</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0">📧</span>
                  <span className="truncate">jean@exemple.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0">🌐</span>
                  <span className="truncate">www.jeandupont.com</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge className="bg-green-500 text-xs sm:text-sm">En ligne</Badge>
                <Badge className="bg-blue-500 text-xs sm:text-sm">Disponible</Badge>
              </div>
            </div>

            {/* Effets visuels - Responsive */}
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-20 sm:h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-8 h-8 sm:w-16 sm:h-16 bg-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>

          {/* Avantages - Responsive */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Share2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Partage Instantané</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Partagez vos informations en un clic via QR code, lien ou NFC. Fini les cartes perdues !</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Toujours À Jour</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Modifiez vos informations en temps réel. Tous vos contacts voient automatiquement les mises à jour.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Analytics Intégrées</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Suivez qui consulte votre carte et optimisez votre networking.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Impact Écologique</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Réduisez votre empreinte carbone en éliminant l'impression de cartes papier.</p>
                </div>
              </div>
            </div>

            {/* CTA Card - Responsive */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <h4 className="text-lg sm:text-xl font-semibold mb-2">Prêt à révolutionner votre networking ?</h4>
                <p className="mb-4 opacity-90 text-sm sm:text-base">Rejoignez les milliers de professionnels qui utilisent déjà nos cartes digitales.</p>
                <Button className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto">
                  Voir la démonstration
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
