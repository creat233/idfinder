
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
    },
    {
      title: "51. Marketplace d'objets trouvés non réclamés",
      description: "Vendre aux enchères les objets non réclamés après un certain délai, avec une partie des bénéfices reversée à des associations."
    },
    {
      title: "52. Notifications intelligentes",
      description: "Envoyer des rappels pour renouveler des documents qui vont bientôt expirer, en se basant sur les cartes enregistrées."
    },
    {
      title: "53. Partenariats avec les mairies",
      description: "Intégrer le service avec les bureaux des objets trouvés des mairies pour centraliser les déclarations."
    },
    {
      title: "54. Témoignages vidéo d'utilisateurs",
      description: "Créer une section sur le site avec des histoires de réussite pour inspirer confiance."
    },
    {
      title: "55. Mode 'Ne pas déranger'",
      description: "Permettre de suspendre les notifications pour certaines cartes ou pendant des périodes définies."
    },
    {
      title: "56. Statistiques personnelles",
      description: "Montrer à l'utilisateur combien de fois son profil a été consulté, ou combien de personnes ont scanné ses QR codes."
    },
    {
      title: "57. Intégration avec les agendas (Google Calendar, etc.)",
      description: "Pour ajouter des rappels de rendez-vous pour le renouvellement de documents."
    },
    {
      title: "58. Service de destruction sécurisée de documents",
      description: "Proposer un service pour détruire les anciens documents (CNI, passeports) de manière sécurisée."
    },
    {
      title: "59. Extension de navigateur",
      description: "Une extension qui pourrait aider à remplir automatiquement des formulaires avec les informations des documents (avec l'accord de l'utilisateur)."
    },
    {
      title: "60. Version 'Lite' de l'application",
      description: "Une version allégée pour les téléphones avec peu d'espace de stockage ou une connexion internet lente."
    },
    {
      title: "61. Filtres de recherche avancés",
      description: "Pour les administrateurs, permettre de filtrer les cartes par région, type, date de perte, etc."
    },
    {
      title: "62. 'Mur de la générosité'",
      description: "Un espace pour mettre en avant les trouveurs les plus actifs ou les histoires les plus touchantes."
    },
    {
      title: "63. Codes QR dynamiques",
      description: "Permettre de changer les informations liées à un QR code sans avoir à le réimprimer."
    },
    {
      title: "64. Support multicanal",
      description: "En plus de WhatsApp, proposer un chat en direct sur le site web."
    },
    {
      title: "65. Programme éducatif dans les écoles",
      description: "Sensibiliser les jeunes à l'importance de la protection de leurs documents."
    },
    {
      title: "66. Kits 'Prêt-à-voyager'",
      description: "Vendre des packs incluant des stickers QR, une pochette de voyage et un guide de sécurité."
    },
    {
      title: "67. Gamification de l'apprentissage",
      description: "Des quizz ou des défis pour apprendre à mieux utiliser l'application et ses fonctionnalités."
    },
    {
      title: "68. Partenariat avec des influenceurs voyage",
      description: "Pour promouvoir l'application auprès des voyageurs."
    },
    {
      title: "69. Alertes de sécurité",
      description: "Informer les utilisateurs sur les nouvelles arnaques ou les risques liés à la perte de documents."
    },
    {
      title: "70. 'Mode panique'",
      description: "Un bouton qui, en cas de vol de sac, permet de bloquer toutes les cartes enregistrées d'un coup."
    },
    {
      title: "71. Impression de cartes de visite avec QR code FinderID",
      description: "Pour les professionnels qui veulent protéger leurs contacts."
    },
    {
      title: "72. Synchronisation cloud",
      description: "Sauvegarder les données de l'utilisateur sur un cloud sécurisé pour une restauration facile."
    },
    {
      title: "73. Reconnaissance optique de caractères (OCR)",
      description: "Pour scanner un document et pré-remplir les informations dans l'application."
    },
    {
      title: "74. Thèmes personnalisables pour l'application",
      description: "Laisser les utilisateurs choisir les couleurs ou le mode d'affichage de l'interface."
    },
    {
      title: "75. Service de livraison express des objets trouvés",
      description: "En partenariat avec un service de coursier."
    },
    {
      title: "76. Abonnement 'Entreprise'",
      description: "Un tableau de bord pour les entreprises pour gérer les cartes de leurs employés."
    },
    {
      title: "77. Intégration avec les services de police",
      description: "Faciliter la déclaration de perte/vol en pré-remplissant les formulaires officiels."
    },
    {
      title: "78. Rapports d'impact social",
      description: "Montrer combien de familles ont été aidées, le temps économisé, etc."
    },
    {
      title: "79. 'Coffre-fort' pour les mots de passe",
      description: "Un espace sécurisé pour stocker des informations sensibles."
    },
    {
      title: "80. Webinaires sur la cybersécurité",
      description: "Eduquer les utilisateurs sur les risques en ligne."
    },
    {
      title: "81. Badges de confiance pour les utilisateurs",
      description: "Vérifier l'identité des utilisateurs pour augmenter la sécurité des échanges."
    },
    {
      title: "82. QR codes sur les bagages",
      description: "Des étiquettes spéciales pour les valises."
    },
    {
      title: "83. Géolocalisation du dernier scan",
      description: "Indiquer sur une carte où le QR code a été scanné pour la dernière fois (avec l'accord du trouveur)."
    },
    {
      title: "84. Historique des modifications",
      description: "Permettre de voir qui a modifié une information et quand."
    },
    {
      title: "85. Export des données utilisateur",
      description: "Permettre de télécharger toutes ses informations au format PDF ou CSV."
    },
    {
      title: "86. Centre d'aide interactif",
      description: "Avec des guides vidéo et des FAQ dynamiques."
    },
    {
      title: "87. Notifications de proximité (Bluetooth LE)",
      description: "Pour retrouver des objets proches (clés, portefeuille)."
    },
    {
      title: "88. 'Mode enfant'",
      description: "Une interface simplifiée pour que les enfants puissent aussi utiliser le service pour leurs affaires scolaires."
    },
    {
      title: "89. Partenariat avec des espaces de coworking",
      description: "Pour protéger le matériel informatique des membres."
    },
    {
      title: "90. Sondages et boîte à idées",
      description: "Pour recueillir les suggestions des utilisateurs directement dans l'app."
    },
    {
      title: "91. Service de traduction automatique dans le chat",
      description: "Pour faciliter la communication entre trouveurs et propriétaires de différentes nationalités."
    },
    {
      title: "92. 'Checklist de voyage' personnalisable",
      description: "Aider les utilisateurs à ne rien oublier avant de partir."
    },
    {
      title: "93. Récompenses pour les trouveurs",
      description: "Permettre au propriétaire d'envoyer une récompense monétaire (pourboire) au trouveur de manière sécurisée."
    },
    {
      title: "94. Analyse prédictive des pertes",
      description: "Identifier les schémas et alerter les utilisateurs dans les zones à haut risque."
    },
    {
      title: "95. Widget pour l'écran d'accueil du téléphone",
      description: "Pour un accès rapide à ses cartes ou pour scanner un code."
    },
    {
      title: "96. Intégration avec les assistants vocaux (Google Assistant, Siri)",
      description: "'Hey Google, où est mon portefeuille ?'"
    },
    {
      title: "97. Assurance pour les frais de remplacement",
      description: "Couvrir le coût de refabrication des documents."
    },
    {
      title: "98. Certificats de restitution",
      description: "Générer un document officiel attestant qu'un objet a été rendu."
    },
    {
      title: "99. Communauté d'entraide locale",
      description: "Mettre en relation des utilisateurs dans une même ville."
    },
    {
      title: "100. Version open source d'une partie du code",
      description: "Pour encourager la collaboration et la transparence."
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
