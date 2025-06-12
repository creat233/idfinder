
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";

interface CardNotFoundProps {
  onBackToHome: () => void;
}

export const CardNotFound = ({ onBackToHome }: CardNotFoundProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Carte non trouvée
            </h1>
            <p className="text-gray-600 mb-8">
              Cette carte n'existe pas ou n'est plus disponible pour récupération.
            </p>
            <Button onClick={onBackToHome} className="bg-[#9b87f5] hover:bg-[#7E69AB]">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
