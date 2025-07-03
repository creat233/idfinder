import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MCardVisitorCTA = () => {
  const navigate = useNavigate();

  const handleCreateMCard = () => {
    navigate('/mcards');
  };

  return (
    <Card className="mt-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-dashed border-blue-300 hover:border-blue-400 transition-all duration-300">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Zap className="h-3 w-3 text-yellow-800" />
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Créez votre propre carte mCard !
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Rejoignez des milliers de professionnels qui utilisent FinderID pour créer leur carte de visite numérique et développer leur réseau.
        </p>
        
        <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span>5000+ utilisateurs</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>Design moderne</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-500" />
            <span>Activation rapide</span>
          </div>
        </div>
        
        <Button 
          onClick={handleCreateMCard}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full shadow-xl transform transition-all duration-200 hover:scale-105 hover:shadow-2xl"
        >
          Créer ma carte mCard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <p className="text-xs text-gray-500 mt-4">
          Commencez dès maintenant • Plans à partir de 2000 FCFA/mois
        </p>
      </CardContent>
    </Card>
  );
};