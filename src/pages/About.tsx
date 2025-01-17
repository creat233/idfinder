import { Card } from "@/components/ui/card";
import { Shield, UserCheck, Award, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12">
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

        <h1 className="text-4xl font-bold text-center mb-4">À propos d'IDFinder</h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Notre mission est de faciliter la restitution des pièces d'identité perdues tout en récompensant l'honnêteté citoyenne.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 text-center">
            <Shield className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Sécurité Garantie</h3>
            <p className="text-gray-600">
              Protection maximale des données personnelles et transactions sécurisées
            </p>
          </Card>

          <Card className="p-6 text-center">
            <UserCheck className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Vérification Rigoureuse</h3>
            <p className="text-gray-600">
              Processus de vérification strict pour garantir la légitimité des restitutions
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Award className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Récompenses Justes</h3>
            <p className="text-gray-600">
              2000 CHF de récompense pour chaque carte restituée
            </p>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
          <p className="text-gray-600 mb-6">
            IDFinder est né de la volonté de créer une solution innovante pour faciliter la restitution des pièces d'identité perdues. Notre plateforme combine technologie et confiance pour créer un service bénéfique pour tous.
          </p>
          <p className="text-gray-600 mb-6">
            Depuis notre création, nous avons déjà permis la restitution de nombreuses pièces d'identité et distribué plus de 150'000 CHF de récompenses à nos utilisateurs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;