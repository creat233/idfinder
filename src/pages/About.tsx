
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, UserCheck, Award, ArrowLeft, Users, Book, CheckCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">À propos de FinderID</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre mission est de faciliter la restitution des pièces d'identité perdues tout en récompensant l'honnêteté citoyenne.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Shield className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Sécurité Garantie</h3>
            <p className="text-gray-600">
              Protection maximale des données personnelles et transactions sécurisées pour tous les utilisateurs
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CheckCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Vérification Rigoureuse</h3>
            <p className="text-gray-600">
              Processus de vérification strict pour garantir la légitimité des restitutions et empêcher les fraudes
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Award className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Récompenses Justes</h3>
            <p className="text-gray-600">
              2000 Fr de récompense pour chaque carte restituée à son propriétaire légitime
            </p>
          </Card>
        </div>

        {/* Our History */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Notre Histoire</h2>
          <div className="bg-gray-50 p-8 rounded-lg">
            <p className="text-gray-700 mb-6 leading-relaxed">
              FinderID est né de la volonté de créer une solution innovante pour faciliter la restitution des pièces d'identité perdues au Sénégal. Notre plateforme combine technologie et confiance pour créer un service bénéfique pour tous les citoyens.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Depuis notre création, nous avons déjà permis la restitution de nombreuses pièces d'identité et distribué plus de 150'000 Fr de récompenses à nos utilisateurs, contribuant ainsi à renforcer les liens de confiance dans notre communauté.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">L'Impact de FinderID</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center p-6 bg-secondary/10">
              <CardContent className="p-0">
                <span className="block text-4xl font-bold text-primary mb-2">500+</span>
                <p className="text-gray-600">Cartes restituées</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-secondary/10">
              <CardContent className="p-0">
                <span className="block text-4xl font-bold text-primary mb-2">2000</span>
                <p className="text-gray-600">Utilisateurs actifs</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-secondary/10">
              <CardContent className="p-0">
                <span className="block text-4xl font-bold text-primary mb-2">150k+</span>
                <p className="text-gray-600">FCFA de récompenses</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-secondary/10">
              <CardContent className="p-0">
                <span className="block text-4xl font-bold text-primary mb-2">14</span>
                <p className="text-gray-600">Régions couvertes</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Nos Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Book className="h-8 w-8 text-secondary mb-2" />
                <CardTitle>Transparence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nous croyons en la transparence totale dans toutes nos opérations et communications avec nos utilisateurs.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Activity className="h-8 w-8 text-secondary mb-2" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nous cherchons constamment à améliorer notre service avec les technologies les plus récentes.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-secondary mb-2" />
                <CardTitle>Communauté</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nous construisons une communauté soudée basée sur la confiance et l'entraide mutuelle.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Notre Équipe</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-1">Amadou Diop</h3>
                <p className="text-gray-500 mb-3">Fondateur & CEO</p>
                <p className="text-gray-600">
                  Passionné par les technologies et l'entrepreneuriat social, Amadou a fondé FinderID pour résoudre un problème quotidien au Sénégal.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-1">Fatou Ndiaye</h3>
                <p className="text-gray-500 mb-3">Directrice Technique</p>
                <p className="text-gray-600">
                  Experte en développement web et mobile, Fatou assure que notre plateforme reste sécurisée et performante.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-1">Moussa Sall</h3>
                <p className="text-gray-500 mb-3">Responsable Relations Publiques</p>
                <p className="text-gray-600">
                  Avec son expertise en communication, Moussa développe des partenariats stratégiques pour étendre notre impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
