
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, MapPin, Phone } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t("appName")}
            </h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              {t("welcomeMessage")}
            </p>
            
            {/* Images des documents */}
            <div className="flex gap-4 my-6">
              <img 
                src="/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png" 
                alt="Document d'identité trouvé" 
                className="w-20 h-20 object-cover rounded-lg border-2 border-white/20 shadow-lg"
              />
              <img 
                src="/lovable-uploads/6fd77bb0-272a-46f6-82b7-417047489a7d.png" 
                alt="Carte étudiante trouvée" 
                className="w-20 h-20 object-cover rounded-lg border-2 border-white/20 shadow-lg"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-[#9b87f5] hover:bg-gray-100 font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById('signaler-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Signaler une carte trouvée
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 rounded-full transition-all duration-300"
                onClick={() => document.getElementById('recherche-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Rechercher ma carte
                <Search className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Statistiques avec livraison */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-purple-200">Cartes retrouvées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-purple-200">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  <MapPin className="h-5 w-5" />
                  24h
                </div>
                <div className="text-sm text-purple-200">Service rapide</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  🚚
                </div>
                <div className="text-sm text-purple-200">Livraison gratuite</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Service actif 24h/7j</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Contact direct avec les trouveurs</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-sm">Géolocalisation précise</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🚚</span>
                  <span className="text-sm">Livraison à domicile disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
