import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ArrowRight, Users, Clock, Award, Share2, Download, Link } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CardSearchForm } from "@/components/card-search/CardSearchForm";

const Dashboard = () => {
  const { toast } = useToast();

  const handleInviteFriend = () => {
    const siteUrl = window.location.origin;
    const apkUrl = `${siteUrl}/FinderID (1).apk`;
    const message = `🔍 Découvre FinderID - L'app qui aide à retrouver les pièces d'identité perdues !\n\n📱 Site web: ${siteUrl}\n💾 Télécharger l'app Android: ${apkUrl}\n\nRejoins-nous pour une communauté solidaire ! 🤝`;
    
    if (navigator.share) {
      navigator.share({
        title: 'FinderID - Retrouvez vos papiers perdus',
        text: message,
        url: siteUrl
      });
    } else {
      navigator.clipboard.writeText(message);
      toast({
        title: "Lien copié !",
        description: "Le message d'invitation a été copié dans le presse-papiers",
      });
    }
  };

  const handleDownloadAPK = () => {
    const link = document.createElement('a');
    link.href = '/FinderID (1).apk';
    link.download = 'FinderID.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement démarré",
      description: "L'application FinderID est en cours de téléchargement",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Retrouvez vos papiers d'identité perdus
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Une solution simple, sécurisée et efficace pour récupérer vos documents d'identité égarés
          </p>
          
          {/* Search Form */}
          <div className="max-w-2xl mx-auto mb-8">
            <CardSearchForm />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <RouterLink to="/signaler">
              <Button 
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
              >
                Signaler une carte trouvée
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </RouterLink>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 rounded-full transition-all duration-300"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Comment ça marche ?
            </Button>
          </div>

          {/* Invite & Download Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleInviteFriend}
              variant="ghost"
              className="text-white border border-white/30 hover:bg-white hover:text-[#9b87f5] px-6 py-3 rounded-full transition-all duration-300"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Inviter un ami
            </Button>
            
            <Button 
              onClick={handleDownloadAPK}
              variant="ghost"
              className="text-white border border-white/30 hover:bg-white hover:text-[#9b87f5] px-6 py-3 rounded-full transition-all duration-300"
            >
              <Download className="mr-2 h-5 w-5" />
              📱 Télécharger l'app
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white" id="how-it-works">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">FinderID en chiffres</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">2'000 Fr</div>
              <div className="text-xl font-semibold text-gray-700 mb-2">Récompense pour les découvreurs</div>
              <div className="text-gray-600">Pour chaque carte restituée</div>
            </div>
            
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">7'000 Fr</div>
              <div className="text-xl font-semibold text-gray-700 mb-2">Frais de récupération</div>
              <div className="text-gray-600">Pour le propriétaire du document</div>
            </div>
            
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">24h</div>
              <div className="text-xl font-semibold text-gray-700 mb-2">Délai moyen de récupération</div>
              <div className="text-gray-600">Service rapide et efficace</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Vous avez trouvé une carte ?</h3>
              <p className="text-gray-600 mb-4">
                Signalez la carte trouvée via notre plateforme en quelques clics. 
                Prenez une photo et indiquez le lieu de découverte.
              </p>
              <RouterLink to="/signaler">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Signaler une carte
                </Button>
              </RouterLink>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Vous avez perdu votre carte ?</h3>
              <p className="text-gray-600 mb-4">
                Recherchez votre document en saisissant son numéro. 
                Nous vous mettrons en contact avec la personne qui l'a trouvée.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Rechercher ma carte
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Partagez FinderID avec vos proches</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Plus nous sommes nombreux, plus nous avons de chances de retrouver les documents perdus rapidement !
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleInviteFriend}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Partager le lien du site
            </Button>
            
            <Button 
              onClick={handleDownloadAPK}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-full"
            >
              <Download className="mr-2 h-5 w-5" />
              Partager l'app Android
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-white/10 rounded-lg max-w-md mx-auto">
            <p className="text-sm mb-2">Lien du site web :</p>
            <div className="flex items-center gap-2 bg-white/20 rounded p-2">
              <Link className="h-4 w-4" />
              <span className="text-sm font-mono">{window.location.origin}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 p-1"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin);
                  toast({ title: "Lien copié !", description: "Le lien a été copié dans le presse-papiers" });
                }}
              >
                📋
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
