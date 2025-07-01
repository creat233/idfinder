
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MCardViewNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Carte non trouvée
            </h1>
            <p className="text-gray-600">
              Cette carte n'existe pas ou n'est pas encore disponible.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
            
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="outline"
              className="w-full"
            >
              <Search className="h-4 w-4 mr-2" />
              Rechercher une carte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
