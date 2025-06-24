
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Share2, Eye, Smartphone, Users, TrendingUp } from "lucide-react";

export const MCardShowcase = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Votre Carte de Visite du Futur
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment nos cartes digitales transforment la façon dont vous partagez vos informations professionnelles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Démonstration visuelle */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl p-8 text-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">JD</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Jean Dupont</h3>
                    <p className="text-blue-200">Entrepreneur Digital</p>
                  </div>
                </div>
                <QrCode className="h-8 w-8 text-blue-300" />
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span>+221 77 123 45 67</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>jean@exemple.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌐</span>
                  <span>www.jeandupont.com</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Badge className="bg-green-500">En ligne</Badge>
                <Badge className="bg-blue-500">Disponible</Badge>
              </div>
            </div>

            {/* Effets visuels */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>

          {/* Avantages */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Share2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Partage Instantané</h3>
                  <p className="text-gray-600">Partagez vos informations en un clic via QR code, lien ou NFC. Fini les cartes perdues !</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Toujours À Jour</h3>
                  <p className="text-gray-600">Modifiez vos informations en temps réel. Tous vos contacts voient automatiquement les mises à jour.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Analytics Intégrées</h3>
                  <p className="text-gray-600">Suivez qui consulte votre carte et optimisez votre networking.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Impact Écologique</h3>
                  <p className="text-gray-600">Réduisez votre empreinte carbone en éliminant l'impression de cartes papier.</p>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-2">Prêt à révolutionner votre networking ?</h4>
                <p className="mb-4 opacity-90">Rejoignez les milliers de professionnels qui utilisent déjà nos cartes digitales.</p>
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
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
