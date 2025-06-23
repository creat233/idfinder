
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MCardViewNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl text-center">
            <CardContent className="p-8">
              <div className="mb-6">
                <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Carte non trouvée
                </h1>
                <p className="text-gray-600">
                  Cette carte de visite n'existe pas ou n'est plus disponible.
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                
                <Button 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Accueil
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500">
                  Vous cherchez votre carte ? 
                  <button 
                    onClick={() => navigate('/mcards')}
                    className="text-blue-600 hover:text-blue-800 ml-1 underline"
                  >
                    Gérez vos mCards
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
