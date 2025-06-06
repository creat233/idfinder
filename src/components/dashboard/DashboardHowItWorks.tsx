
import { Button } from "@/components/ui/button";
import { Link as RouterLink } from "react-router-dom";

export const DashboardHowItWorks = () => {
  return (
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
  );
};
