import { CheckCircle, Search, CreditCard } from "lucide-react";

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Comment ça marche ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <Search className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-4">1. Signalez une carte</h3>
            <p className="text-gray-600">
              Remplissez le formulaire avec les détails de la carte d'identité trouvée
            </p>
          </div>
          <div className="text-center p-6">
            <CheckCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-4">2. Vérification</h3>
            <p className="text-gray-600">
              Notre équipe vérifie les informations et contacte le propriétaire
            </p>
          </div>
          <div className="text-center p-6">
            <CreditCard className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-4">3. Recevez votre récompense</h3>
            <p className="text-gray-600">
              Obtenez 1000 CHF une fois la carte restituée à son propriétaire
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};