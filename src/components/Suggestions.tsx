
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
    },
    {
      title: "8. Offre pour les entreprises (B2B)",
      description: "Créer une offre dédiée aux entreprises pour qu'elles puissent protéger les badges de leurs employés ou leur matériel avec les QR codes FinderID."
    },
    {
      title: "9. Partenariat avec des assurances",
      description: "Collaborer avec des assureurs pour offrir des réductions sur leurs polices aux clients qui utilisent activement FinderID."
    },
    {
      title: "10. Développer une application mobile",
      description: "Créer une application native (iOS/Android) pour une meilleure expérience, avec notifications push et accès hors ligne."
    },
    {
      title: "11. Système de parrainage",
      description: "Permettre aux utilisateurs d'inviter des amis et de gagner des récompenses pour chaque ami qui utilise le service."
    },
    {
      title: "12. Blog et contenu éducatif",
      description: "Créer un blog avec des articles sur la sécurité des biens et des histoires de restitution pour engager la communauté."
    },
    {
      title: "13. Intégration avec les objets connectés (IoT)",
      description: "Explorer des partenariats pour intégrer FinderID avec des traqueurs Bluetooth ou d'autres gadgets."
    },
    {
      title: "14. Assistance perte de documents à l'étranger",
      description: "Offrir un service spécial pour les voyageurs avec des informations sur les démarches consulaires."
    },
    {
      title: "15. Alertes de proximité",
      description: "Dans l'app mobile, alerter un utilisateur s'il s'éloigne trop d'un objet important via un tag."
    },
    {
      title: "16. Fonction 'Coffre-fort numérique'",
      description: "Permettre aux utilisateurs de stocker des copies numériques cryptées de leurs documents."
    },
    {
      title: "17. Campagnes de sensibilisation",
      description: "Mener des campagnes dans les lieux publics (aéroports, gares) pour promouvoir le service."
    },
    {
      title: "18. Service de messagerie anonyme et sécurisé",
      description: "Améliorer la messagerie entre trouveur et propriétaire pour garantir l'anonymat."
    },
    {
      title: "19. Personnalisation des stickers QR Code",
      description: "Laisser les utilisateurs choisir le design ou ajouter un message personnalisé sur leurs stickers."
    },
    {
      title: "20. Programme de fidélité",
      description: "Récompenser les utilisateurs fidèles avec des avantages exclusifs, des réductions et un statut spécial."
    },
    {
      title: "21. API pour les développeurs",
      description: "Ouvrir une API pour permettre à des services tiers d'intégrer la recherche d'objets ou de documents."
    },
    {
      title: "22. Assurance perte/vol",
      description: "Proposer une micro-assurance en partenariat pour couvrir les frais de remplacement des documents en cas de non-récupération."
    },
    {
      title: "23. Tableau de bord pour les entreprises partenaires",
      description: "Fournir un tableau de bord aux entreprises pour suivre l'utilisation des QR codes par leurs employés."
    },
    {
      title: "24. Version multilingue étendue",
      description: "Ajouter plus de langues locales (wolof, pulaar, etc.) et internationales pour une meilleure accessibilité."
    },
    {
      title: "25. Dons à des œuvres caritatives",
      description: "Permettre aux utilisateurs de faire un don à une association lors de la récupération d'un objet."
    },
    {
      title: "26. Kiosques libre-service",
      description: "Installer des bornes dans des lieux publics (mairies, centres commerciaux) pour déclarer ou rechercher un document."
    },
    {
      title: "27. Rapports de statistiques publiques",
      description: "Publier des rapports anonymisés sur les types de documents les plus perdus et les zones à risque pour sensibiliser."
    },
    {
      title: "28. Fonction 'Voyage'",
      description: "Permettre d'activer un mode 'voyage' qui sauvegarde temporairement des informations utiles (numéro de vol, réservation d'hôtel)."
    },
    {
      title: "29. Alertes SMS",
      description: "En plus des notifications push, proposer des alertes par SMS pour les utilisateurs sans smartphone ou sans connexion internet."
    },
    {
      title: "30. Validation d'identité renforcée",
      description: "Mettre en place une vérification d'identité plus poussée pour le propriétaire avant de dévoiler les informations de récupération."
    },
    {
      title: "31. Guide des bonnes pratiques",
      description: "Créer un guide interactif dans l'application pour apprendre aux utilisateurs comment mieux protéger leurs affaires au quotidien."
    },
    {
      title: "32. Mode Famille",
      description: "Permettre de lier les comptes des membres d'une famille pour gérer les objets de tous."
    },
    {
      title: "33. Impression à domicile",
      description: "Fournir des modèles de QR codes à imprimer soi-même pour une solution rapide et gratuite."
    },
    {
      title: "34. Challenge de la communauté",
      description: "Organiser des événements (en ligne ou hors ligne) pour encourager les restitutions."
    },
    {
      title: "35. Intégration avec les réseaux sociaux",
      description: "Partage facile des trouvailles (de manière anonyme) pour augmenter la portée."
    },
    {
      title: "36. Service de conciergerie",
      description: "Un service premium pour s'occuper de toutes les démarches de récupération à la place de l'utilisateur."
    },
    {
      title: "37. QR Codes pour animaux de compagnie",
      description: "Des médailles QR pour les colliers d'animaux."
    },
    {
      title: "38. Feedback et notation",
      description: "Permettre au propriétaire de noter l'expérience avec le trouveur (et vice-versa) pour renforcer la confiance."
    },
    {
      title: "39. Rapports d'incidents détaillés",
      description: "Permettre de joindre plus d'informations lors de la déclaration de perte (circonstances, etc.)."
    },
    {
      title: "40. Fonctionnalité 'scanner' dans l'app",
      description: "Intégrer un lecteur de QR code directement dans l'app pour ne pas dépendre de l'appareil photo natif."
    },
    {
      title: "41. Carte des 'zones chaudes' de perte",
      description: "Utiliser les données pour montrer les endroits où les objets sont le plus souvent perdus."
    },
    {
      title: "42. Partenariats avec des événements",
      description: "Fournir des bracelets ou badges QR pour les festivals, conférences, etc."
    },
    {
      title: "43. Support client via WhatsApp",
      description: "Offrir un canal de support plus direct et populaire."
    },
    {
      title: "44. Contenu vidéo",
      description: "Tutoriels, témoignages et astuces en format vidéo."
    },
    {
      title: "45. Programme Ambassadeur",
      description: "Recruter des ambassadeurs dans les universités ou les grandes entreprises pour promouvoir le service."
    },
    {
      title: "46. Service d'impression et livraison de stickers",
      description: "Commander des stickers personnalisés et les recevoir à domicile."
    },
    {
      title: "47. 'Mode vacances' amélioré",
      description: "Bloquer temporairement les cartes et documents signalés non-utilisés pendant un voyage."
    },
    {
      title: "48. Intégration avec des services de VTC",
      description: "Partenariat avec Uber/Yango pour faciliter la récupération d'objets oubliés dans les voitures."
    },
    {
      title: "49. Génération de documents temporaires",
      description: "En cas de perte de CNI, générer une attestation temporaire (si légalement possible)."
    },
    {
      title: "50. IA pour aider à la description",
      description: "Utiliser l'IA pour aider les trouveurs à décrire l'objet trouvé de manière précise."
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
