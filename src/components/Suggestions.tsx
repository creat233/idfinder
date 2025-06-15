
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Suggestions = () => {
  const suggestions = [
    {
      title: "1. Enrichir le tableau de bord de l'utilisateur",
      description: "Ajouter un résumé de ses cartes, notifications et gains pour le rendre plus personnel."
    },
    {
      title: "2. Ajouter des graphiques pour l'administration",
      description: "Créer un graphique des inscriptions pour mieux visualiser la croissance de la plateforme."
    },
    {
      title: "3. Optimiser la page 'carte trouvée'",
      description: "Améliorer les instructions pour la récupération de la carte, avec potentiellement une carte géographique."
    },
    {
      title: "4. Vendre des stickers QR Code physiques",
      description: "Créer une boutique pour vendre des stickers QR à coller sur n'importe quel objet (clés, sac...). Les affiliés peuvent toucher une commission sur les ventes."
    },
    {
      title: "5. Offre 'Premium' pour les utilisateurs",
      description: "Proposer un abonnement payant qui donnerait des avantages : plus de codes promo, commissions plus élevées, et support prioritaire."
    },
    {
      title: "6. Mettre en place un système de 'gamification'",
      description: "Introduire des badges ou des classements pour les utilisateurs qui signalent le plus de cartes afin d'augmenter l'engagement."
    },
    {
      title: "7. Partenariats avec des commerces",
      description: "S'associer avec des magasins ou cafés pour qu'ils deviennent des points de dépôt/collecte officiels pour les objets trouvés."
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <Card className="border-orange-500 border-2">
        <CardHeader>
          <CardTitle className="text-orange-600">Suggestions pour améliorer l'application</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-700">
            Bonjour ! Puisque mes messages ne s'affichent pas dans le chat, voici mes suggestions directement ici. Dites-moi laquelle vous préférez, et je retirerai ce panneau pour commencer à travailler dessus.
          </p>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-lg">{suggestion.title}</h3>
                <p className="text-gray-800">{suggestion.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
