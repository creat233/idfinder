
import { Users, Clock, Award } from "lucide-react";

export const DashboardStats = () => {
  return (
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
  );
};
